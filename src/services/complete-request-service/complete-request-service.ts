import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ValidationBag } from "@/utility/validation-bag";
import { Generator } from "@/utility/generator";
import { optional } from "@/utility/optional";
import { DateTime } from "@/utility/date-time";

import { RequestRepository } from "@/repositories/request-repository";
import { SessionRecord } from "@/records/session-record";
import { getTokensByUserId } from "@/data/clients-sessions";
import NotificationFCM from "@/utility/notification/notification";
import { RequestUpdate } from "@/schemas/request-schema";
import { transactionService } from "../transaction-service";

type Props = {
  requestRepository: RequestRepository;
};

type Input = {
  id: string;
  remarks: string | null;
  attachments?: string[];
  sessionRecord: SessionRecord;
};

export class CompleteRequestService {
  protected _requestRepository: RequestRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);

    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const requestRecord = await this._requestRepository.get(id.get());
    if (typeof requestRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const remarks = Attribute.make(optional(input.remarks, null));
    const attachments = Attribute.make(optional(input.attachments, []));
    const validationBag = ValidationBag.make();

    validationBag.set(
      "remarks",
      Validation.make(remarks.get()).optional().string().getRule()
    );
    validationBag.set(
      "attachments",
      Validation.make(attachments.get()).optional().array().getRule()
    );

    if (!validationBag.hasError("attachments")) {
      // eslint-disable-next-line max-len
      for (const [index, attachment] of attachments.get().entries()) {
        validationBag.set(
          `attachments.${index}`,
          Validation.make(attachment).optional().string().getRule()
        );
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    requestRecord.status = "completed";
    requestRecord.completedAt = DateTime.now().toString();
    requestRecord.completeRemarks = remarks.get();
    requestRecord.completeAttachments = attachments.get();

    const updateData = new RequestUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      // eslint-disable-next-line max-len
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "completed",
      date: DateTime.now().toString(),
    });

    await this._requestRepository.Update(
      requestRecord,
      updateData,
      RequestUpdate,
      "updates"
    );

    await transactionService.logRequestCompleted(requestRecord);

    const customerToken = getTokensByUserId(requestRecord.customerId);
    if (customerToken.length > 0) {
      await Promise.all([
        NotificationFCM.getInstance().sendToMany(
          {
            messageId: Generator.id(),
            title: "Your request has been processed",
            body: `Dear ${requestRecord.customerName}, we value your feedback. 
Please take a moment to rate the completed task. \
Your input helps us improve our services.`,
            id: requestRecord.id,
            type: "request",
          },
          customerToken
        ),
        NotificationFCM.getInstance().sendToMany(
          {
            messageId: Generator.id(),
            title: "Rate Your Completed Request",
            body: `Dear ${requestRecord.customerName}, 
we are pleased to inform you that your request has been successfully \
processed.`,
            id: requestRecord.id,
            type: "request",
          },
          customerToken
        ),
      ]);
    }

    return Result.ok(undefined);
  }
}
