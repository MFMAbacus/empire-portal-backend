import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ValidationBag } from "@/utility/validation-bag";
import { Generator } from "@/utility/generator";
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
  sessionRecord: SessionRecord;
};

export class RefuseRequestService {
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

    if (requestRecord.isApproved || requestRecord.isRefused) {
      return Result.fail(Failure.badRequest());
    }

    const remarks = Attribute.make(input.remarks);
    const validationBag = ValidationBag.make();

    validationBag.set(
      "remarks",
      Validation.make(remarks.get()).optional().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    requestRecord.isRefused = true;
    requestRecord.refusedAt = DateTime.now().toString();
    requestRecord.refuseRemarks = remarks.get();

    const updateData = new RequestUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "refused",
      date: DateTime.now().toString(),
    });

    await this._requestRepository.Update(
      requestRecord,
      updateData,
      RequestUpdate,
      "updates"
    );

    await transactionService.logRequestRefused(requestRecord);

    if (requestRecord.staffId) {
      const staffTokens = getTokensByUserId(requestRecord.staffId);
      if (staffTokens) {
        await NotificationFCM.getInstance().sendToMany(
          {
            messageId: Generator.id(),
            title: "Requested Items Rejected",
            body: `Dear ${requestRecord.staffName},
Items in request ${requestRecord.id} have been rejected.`,
            id: requestRecord.id,
            type: "request",
          },
          staffTokens
        );
      }
    }

    return Result.ok(undefined);
  }
}
