import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Hash } from "@/utility/hash";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ValidationRule } from "@/utility/validation-rule";

import { CustomerRepository } from "@/repositories/customer-repository";
import { OtpRepository } from "@/repositories/otp-repository";
import { Attribute } from "@/utility/attribute";
import { CustomerModel } from "@/models/customer-model";

type Props = {
  customerRepository: CustomerRepository;
  otpRepository: OtpRepository;
};

type Input = {
  token: string;
  username: string;
  newPassword: string;
};

export class SetPasswordService {
  protected _customerRepository: CustomerRepository;
  protected _otpRepository: OtpRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
    this._otpRepository = props.otpRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const token = Attribute.make(input.token);
    const username = Attribute.make(input.username);
    const newPassword = Attribute.make(input.newPassword);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "token",
      Validation.make(token.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "username",
      Validation.make(username.get()).optional().string().getRule()
    );
    validationBag.set(
      "newPassword",
      Validation.make(newPassword.get()).mandatory().string().getRule()
    );

    if (!validationBag.hasError("username")) {
      const usernameTaken = await this._customerRepository.existsByUsername(
        username.get()
      );
      if (usernameTaken) {
        validationBag.set("username", ValidationRule.valueIsAlreadyUsed());
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const otpRecord = await this._otpRepository.getByToken(token.get());

    if (typeof otpRecord === "undefined") {
      return Result.fail(Failure.invalidToken());
    }

    const customerRecord = await this._customerRepository.get(
      otpRecord.customerId
    );
    if (typeof customerRecord === "undefined") {
      return Result.fail(Failure.invalidToken());
    }

    if (!customerRecord.isInvited) {
      return Result.fail(Failure.customerNotInvited());
    }

    if (customerRecord.isBlocked) {
      return Result.fail(Failure.customerBlocked());
    }

    const customerModel = CustomerModel.make(customerRecord);
    customerModel.set("isActive", true);
    if (username.get()) {
      customerModel.set("username", username.get());
    }
    customerModel.set("password", Hash.make(newPassword.get()));

    await this._customerRepository.Update(customerModel.getRecord());
    await this._otpRepository.Delete(otpRecord.id);

    return Result.ok(undefined);
  }
}
