import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Hash } from "@/utility/hash";
import { Generator } from "@/utility/generator";
import { ValidationBag } from "@/utility/validation-bag";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { OtpRecord } from "@/records/otp-record";
import { UserRepository } from "@/repositories/user-repository";
import { OtpRepository } from "@/repositories/otp-repository";

import { SendSmsService } from "@/services/send-sms-service";
import { Otp } from "@/schemas/otp-schema";

type Props = {
  userRepository: UserRepository;
  otpRepository: OtpRepository;
  sendSmsService: SendSmsService;
};

type Input = {
  phoneNumber: string;
};

export class SendStaffOtpService {
  protected _userRepository: UserRepository;
  protected _otpRepository: OtpRepository;
  protected _sendSmsService: SendSmsService;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
    this._otpRepository = props.otpRepository;
    this._sendSmsService = props.sendSmsService;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const phoneNumber = Attribute.make(input.phoneNumber);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "phoneNumber",
      Validation.make(phoneNumber.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const userRecord = await this._userRepository.getByPhoneNumber(
      phoneNumber.get()
    );
    if (typeof userRecord === "undefined" || !userRecord.isMobileUser) {
      return Result.fail(Failure.staffNotFound());
    }

    const id = Generator.shortToken();
    const password = Generator.otp();
    const customerId = userRecord.id;
    const token = Hash.make(id + password + customerId);

    const otpRecord = new Otp({
      id,
      customerId,
      password,
      token,
    });

    await this._otpRepository.Create(otpRecord);

    this._sendSmsService.execute({
      phoneNumber: phoneNumber.get(),
      sms: password,
    });

    return Result.ok(customerId);
  }
}
