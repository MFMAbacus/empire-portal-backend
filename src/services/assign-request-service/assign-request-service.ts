import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";

import { UserRepository } from "@/repositories/user-repository";
import { RequestRepository } from "@/repositories/request-repository";
import { ValidationBag } from "@/utility/validation-bag";
import { ValidationRule } from "@/utility/validation-rule";
import { SessionRecord } from "@/records/session-record";
import { getTokensByUserId } from "@/data/clients-sessions";
import NotificationFCM from "@/utility/notification/notification";
import { RequestUpdate } from "@/schemas/request-schema";
import { IRequestUpdate } from "@/schemas/request-schema";
import { transactionService } from "../transaction-service";

type Props = {
  userRepository: UserRepository;
  requestRepository: RequestRepository;
};

type Input = {
  id: string;
  staffId: string;
  sessionRecord: SessionRecord;
};

export class AssignRequestService {
  protected _userRepository: UserRepository;
  protected _requestRepository: RequestRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
    this._requestRepository = props.requestRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);
    const staffId = Attribute.make(input.staffId);

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

    const validationBag = ValidationBag.make();

    validationBag.set(
      "staffId",
      Validation.make(staffId.get()).mandatory().string().getRule()
    );

    let staffName: string | null = null;
    let salesPersonId: string | null = null;
    if (!validationBag.hasError("staffId")) {
      const staffRecord = await this._userRepository.get(staffId.get());
      if (typeof staffRecord === "undefined" || !staffRecord.isMobileUser) {
        validationBag.set("staffId", ValidationRule.valueIsInvalid());
      } else {
        staffName = `${staffRecord.firstName} ${staffRecord.lastName}`;
        salesPersonId = staffRecord.salespersonId;
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    requestRecord.staffId = staffId.get();
    requestRecord.staffName = staffName;
    requestRecord.salesPersonId = salesPersonId;
    requestRecord.status = "in-progress";
    // requestRecord.updates.push({
    //   id: Generator.shortToken(),
    //   userId: input.sessionRecord.userId,
    //   // eslint-disable-next-line max-len
    //   userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
    //   type: "activated",
    //   date: DateTime.now().toString(),
    // });
    const updateData = new RequestUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      // eslint-disable-next-line max-len
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "activated",
      date: DateTime.now().toString(),
    });

    await this._requestRepository.Update(
      requestRecord,
      updateData,
      RequestUpdate,
      "updates"
    );

    await transactionService.logRequestAssigned(
      requestRecord,
      staffName ?? "-"
    );

    if (requestRecord.staffId) {
      const staffTokens = getTokensByUserId(staffId.get());
      const customerTokens = getTokensByUserId(requestRecord.customerId);

      await Promise.all(
        [
          staffTokens.length > 0 &&
            NotificationFCM.getInstance().sendToMany(
              {
                messageId: Generator.id(),
                title: "Request Assigned",
                body: `Dear ${requestRecord.staffName},
The request ${requestRecord.id} has been assigned to you.`,
                id: requestRecord.id,
                type: "request",
              },
              staffTokens
            ),
          customerTokens.length > 0 &&
            NotificationFCM.getInstance().sendToMany(
              {
                messageId: Generator.id(),
                title: "Request Received",
                body: `Dear ${requestRecord.customerName},
The request ${requestRecord.id} has been reveived and will be processed soon.`,
                id: requestRecord.id,
                type: "request",
              },
              customerTokens
            ),
        ].filter(Boolean)
      );
    }

    return Result.ok(undefined);
  }
}
