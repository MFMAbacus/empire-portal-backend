import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Validation } from "@/utility/validation";
import { ValidationBag } from "@/utility/validation-bag";
import { Attribute } from "@/utility/attribute";

import { OtpRepository } from "@/repositories/otp-repository";

type Props = {
  otpRepository: OtpRepository;
};

type Input = {
  staffId: string;
  password: string;
};

export class CheckStaffOtpService {
  protected _otpRepository: OtpRepository;

  public constructor(props: Props) {
    this._otpRepository = props.otpRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const staffId = Attribute.make(input.staffId);
    const password = Attribute.make(input.password);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "staffId",
      Validation.make(staffId.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "password",
      Validation.make(password.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const otpRecord = await this._otpRepository.Get(
      staffId.get(),
      password.get()
    );
    if (typeof otpRecord === "undefined") {
      return Result.fail(Failure.invalidOtp());
    }

    return Result.ok(otpRecord.token);
  }
}
