import { ISmsRecord, Sms } from "@/schemas/sms-schema";
import { Model } from "mongoose";
import { SmsRepository } from "./sms-repository";
import { MongoRepository } from "@/utility/mongo-repository";

export class SmsRepositoryDb
  extends MongoRepository<ISmsRecord>
  implements SmsRepository
{
  public constructor() {
    super(Sms);
  }

  public async getAll(): Promise<ISmsRecord[]> {
    return await super.getAll();
  }

  public async Create(record: ISmsRecord): Promise<void> {
    await super.create(record);
  }

  public async truncate(maxCount: number): Promise<void> {
    const count = await Sms.countDocuments().exec();
    if (count >= maxCount) {
      await Sms.deleteMany({}).exec();
    }
  }
}
