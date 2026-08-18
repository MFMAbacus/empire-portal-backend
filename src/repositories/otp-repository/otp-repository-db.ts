import { IOtpRecord, Otp } from "@/schemas/otp-schema";
import { Model } from "mongoose";
import { OtpRepository } from "./otp-repository";
import { MongoRepository } from "@/utility/mongo-repository";

export class OtpRepositoryDb
  extends MongoRepository<IOtpRecord>
  implements OtpRepository
{
  public constructor() {
    super(Otp);
  }

  public async Get(
    customerId: string,
    password: string
  ): Promise<IOtpRecord | undefined> {
    const result = await super.FindOne({ customerId, password });
    return result || undefined;
  }

  public async getByToken(token: string): Promise<IOtpRecord | undefined> {
    const result = await super.FindOne({ token });
    return result || undefined;
  }

  public async Create(record: IOtpRecord): Promise<void> {
    await super.create(record);
  }

  public async Delete(id: string): Promise<void> {
    await super.delete(id);
  }
}
