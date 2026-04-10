import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { ISmsRecord } from "@/schemas/sms-schema";
import { SmsRepository } from "@/repositories/sms-repository";

type Props = {
  smsRepository: SmsRepository;
};

export class GetSmsService {
  protected _smsRepository: SmsRepository;

  public constructor(props: Props) {
    this._smsRepository = props.smsRepository;
  }

  public async execute(): Promise<Result<ISmsRecord[], Failure>> {
    const usersRecords = await this._smsRepository.getAll();
    return Result.ok(usersRecords);
  }
}
