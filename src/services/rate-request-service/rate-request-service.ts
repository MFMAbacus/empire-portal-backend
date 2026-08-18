import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ValidationBag } from "@/utility/validation-bag";
import { ValidationRule } from "@/utility/validation-rule";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";

import { RequestRepository } from "@/repositories/request-repository";
import { SessionRecord } from "@/records/session-record";
import { RequestUpdate } from "@/schemas/request-schema";
import { transactionService } from "../transaction-service";

type Props = {
  requestRepository: RequestRepository;
};

type Input = {
  id: string;
  value: number;
  comment: string;
  sessionRecord: SessionRecord;
};

export class RateRequestService {
  protected _requestRepository: RequestRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);
    const value = Attribute.make(input.value);
    const comment = Attribute.make(input.comment);

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
      "value",
      Validation.make(value.get()).mandatory().number().getRule()
    );
    validationBag.set(
      "comment",
      Validation.make(comment.get()).mandatory().string().getRule()
    );

    if (!validationBag.hasError("value")) {
      if (input.value < 0 || input.value > 5) {
        validationBag.set("value", ValidationRule.valueIsInvalid());
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    requestRecord.rate = {
      value: value.get(),
      comment: comment.get(),
    };

    const updateData = new RequestUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "rated",
      date: DateTime.now().toString(),
    });

    await this._requestRepository.Update(
      requestRecord,
      updateData,
      RequestUpdate,
      "updates"
    );

    await transactionService.logRequestRated(requestRecord, value.get());

    return Result.ok(undefined);
  }
}
