import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Hash } from "@/utility/hash";

import { UserRepository } from "@/repositories/user-repository";
import { OtpRepository } from "@/repositories/otp-repository";
import { Attribute } from "@/utility/attribute";
import { UserModel } from "@/models/user-model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";

type Props = {
  userRepository: UserRepository;
  otpRepository: OtpRepository;
};

type Input = {
  token: string;
  newPassword: string;
};

export class SetStaffPasswordService {
  protected _userRepository: UserRepository;
  protected _otpRepository: OtpRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
    this._otpRepository = props.otpRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const token = Attribute.make(input.token);
    const newPassword = Attribute.make(input.newPassword);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "token",
      Validation.make(token.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "newPassword",
      Validation.make(newPassword.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const otpRecord = await this._otpRepository.getByToken(token.get());
    if (typeof otpRecord === "undefined") {
      return Result.fail(Failure.invalidToken());
    }

    const userRecord = await this._userRepository.get(otpRecord.customerId);
    if (typeof userRecord === "undefined") {
      return Result.fail(Failure.invalidToken());
    }

    const userModel = UserModel.make(userRecord);
    userModel.set("password", Hash.make(newPassword.get()));

    await this._userRepository.Update(userModel.getRecord());
    await this._otpRepository.Delete(otpRecord.id);

    return Result.ok(undefined);
  }
}
