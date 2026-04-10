import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Hash } from "@/utility/hash";
import { ValidationBag } from "@/utility/validation-bag";
import { ValidationRule } from "@/utility/validation-rule";

import { CustomerRepository } from "@/repositories/customer-repository";
import { SessionRecord } from "@/records/session-record";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  oldPassword: string;
  newPassword: string;
  sessionRecord: SessionRecord;
};

export class ChangeCustomerPasswordService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    if (input.sessionRecord.role !== "customer") {
      return Result.fail(Failure.unauthorized());
    }

    const oldPassword = Attribute.make(input.oldPassword);
    const newPassword = Attribute.make(input.newPassword);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "oldPassword",
      Validation.make(oldPassword.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "newPassword",
      Validation.make(newPassword.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const id = input.sessionRecord.userId;
    const customerRecord = await this._customerRepository.get(id);
    if (typeof customerRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const hashedOldPassword = Hash.make(oldPassword.get());
    if (customerRecord.password !== hashedOldPassword) {
      validationBag.set("oldPassword", ValidationRule.valueIsInvalid());
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    customerRecord.password = Hash.make(newPassword.get());

    await this._customerRepository.Update(customerRecord);

    return Result.ok(undefined);
  }
}
