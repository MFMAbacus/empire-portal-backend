import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Hash } from "@/utility/hash";
import { Generator } from "@/utility/generator";
import { ValidationBag } from "@/utility/validation-bag";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { IOtpRecord, Otp } from "@/schemas/otp-schema";
import { CustomerRepository } from "@/repositories/customer-repository";
import { OtpRepository } from "@/repositories/otp-repository";

import { SendSmsService } from "@/services/send-sms-service";

type Props = {
  customerRepository: CustomerRepository;
  otpRepository: OtpRepository;
  sendSmsService: SendSmsService;
};

type Input = {
  phoneNumber: string;
  isReset: boolean;
};

export class SendOtpService {
  protected _customerRepository: CustomerRepository;
  protected _otpRepository: OtpRepository;
  protected _sendSmsService: SendSmsService;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
    this._otpRepository = props.otpRepository;
    this._sendSmsService = props.sendSmsService;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const phoneNumber = Attribute.make(input.phoneNumber);
    const isReset = Attribute.make(input.isReset);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "phoneNumber",
      Validation.make(phoneNumber.get()).mandatory().string().getRule()
    );

    validationBag.set(
      "isReset",
      Validation.make(isReset.get()).optional().boolean().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const customerRecord = await this._customerRepository.getByPhoneNumber(
      phoneNumber.get()
    );
    if (typeof customerRecord === "undefined") {
      return Result.fail(Failure.customerNotFound());
    }

    const customerRecordUserName = await this._customerRepository.getByUsername(
      phoneNumber.get()
    );

    if (isReset.get()) {
      //Reset PW Flow
      if (!customerRecordUserName) {
        return Result.fail(Failure.customerNotFound());
      }
    } else {
      //Register Flow
      if (customerRecordUserName) {
        return Result.fail(Failure.valueIsAlreadyUsed());
      }
    }

    if (!customerRecord.isInvited) {
      return Result.fail(Failure.customerNotInvited());
    }

    if (customerRecord.isBlocked) {
      return Result.fail(Failure.customerBlocked());
    }

    const id = Generator.shortToken();
    const password = Generator.otp();
    const customerId = customerRecord.id;
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
      sms: "Your verification code is: " + password,
    });

    return Result.ok(customerId);
  }
}
