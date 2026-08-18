import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ValidationBag } from "@/utility/validation-bag";

import { RequestRepository } from "@/repositories/request-repository";
import { SessionRecord } from "@/records/session-record";
import { transactionService } from "../transaction-service";

type Props = {
  requestRepository: RequestRepository;
};

type Input = {
  id: string;
  pin: string;
  attachments: string[];
  sessionRecord: SessionRecord;
};

export class SetRequestPinService {
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

    const pin = Attribute.make(input.pin);
    const attachments = Attribute.make(input.attachments);
    const validationBag = ValidationBag.make();

    validationBag.set(
      "pin",
      Validation.make(pin.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "attachments",
      Validation.make(attachments.get()).mandatory().array().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    requestRecord.pin = input.pin;
    requestRecord.buyAttachments = input.attachments;

    await this._requestRepository.Update(requestRecord);

    await transactionService.logRequestPinSet(requestRecord);

    return Result.ok(undefined);
  }
}
