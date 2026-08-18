import { IOtpRecord } from "@/schemas/otp-schema";

export abstract class OtpRepository {
  public abstract Get(
    customerId: string,
    password: string
  ): Promise<IOtpRecord | undefined>;
  public abstract getByToken(token: string): Promise<IOtpRecord | undefined>;
  public abstract Create(record: IOtpRecord): Promise<void>;
  public abstract Delete(id: string): Promise<void>;
}
