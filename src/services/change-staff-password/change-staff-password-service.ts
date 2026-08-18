import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Hash } from "@/utility/hash";
import { ValidationBag } from "@/utility/validation-bag";
import { ValidationRule } from "@/utility/validation-rule";

import { UserRepository } from "@/repositories/user-repository";
import { SessionRecord } from "@/records/session-record";

type Props = {
  userRepository: UserRepository;
};

type Input = {
  oldPassword: string;
  newPassword: string;
  sessionRecord: SessionRecord;
};

export class ChangeStaffPasswordService {
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    if (input.sessionRecord.role !== "staff") {
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
    const userRecord = await this._userRepository.get(id);
    if (typeof userRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const hashedOldPassword = Hash.make(oldPassword.get());
    if (userRecord.password !== hashedOldPassword) {
      validationBag.set("oldPassword", ValidationRule.valueIsInvalid());
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    userRecord.password = Hash.make(newPassword.get());

    await this._userRepository.Update(userRecord);

    return Result.ok(undefined);
  }
}
