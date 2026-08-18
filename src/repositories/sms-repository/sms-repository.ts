import { ISmsRecord } from "@/schemas/sms-schema";

export abstract class SmsRepository {
  public abstract getAll(): Promise<ISmsRecord[]>;
  public abstract Create(record: ISmsRecord): Promise<void>;
  public abstract truncate(maxCount: number): Promise<void>;
}
