import axios from "axios";
import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { SmsRepository } from "@/repositories/sms-repository";
import { Sms } from "@/schemas/sms-schema";
import { Buffer } from "buffer"; // Ensure buffer is imported for encoding

type Props = {
  smsRepository: SmsRepository;
};

type Input = {
  phoneNumber: string;
  sms: string;
};

const smsUrl = "https://qy3pyq.api.infobip.com/sms/2/text/advanced";
const smsApiUsername = "saad.sabri";
const smsApiPassword = "+EX&i?x-@#6%7sP";
const smsApiSource = "EmpireWorld";

export class SendSmsService {
  protected _smsRepository: SmsRepository;

  public constructor(props: Props) {
    this._smsRepository = props.smsRepository;
  }

  public async execute(input: Input): Promise<Result<null, Failure>> {
    const token = Buffer.from(`${smsApiUsername}:${smsApiPassword}`).toString(
      "base64"
    );
    input.phoneNumber = input.phoneNumber.replace(/^0/, "+964");
    const response = await axios.request({
      url: smsUrl,
      method: "POST",
      data: {
        messages: [
          {
            destinations: [
              {
                to: input.phoneNumber,
              },
            ],
            from: smsApiSource,
            text: input.sms,
          },
        ],
      },
      headers: {
        Authorization: `Basic ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await this._smsRepository.truncate(5);
    const smsData = new Sms({
      phoneNumber: input.phoneNumber,
      sms: input.sms,
    });
    await this._smsRepository.Create(smsData);
    return Result.ok(null);
  }
}
