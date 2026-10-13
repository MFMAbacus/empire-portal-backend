import { IReplacementFeeMaster } from "@/schemas/replacement-fee-master-schema";
import ReplacementFeeMaster from "@/schemas/replacement-fee-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ReplacementFeeMasterRepository,
  GetAllReplacementFeeMasterOptions,
} from "./replacement-fee-master-repository";

export class ReplacementFeeMasterRepositoryDb
  extends MongoRepository<IReplacementFeeMaster>
  implements ReplacementFeeMasterRepository
{
  public constructor() {
    super(ReplacementFeeMaster);
  }

  public async getAll(options: GetAllReplacementFeeMasterOptions = {}): Promise<IReplacementFeeMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IReplacementFeeMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IReplacementFeeMaster>): Promise<IReplacementFeeMaster> {
    return await super.create(record as IReplacementFeeMaster);
  }

  public async Update(record: Partial<IReplacementFeeMaster>): Promise<IReplacementFeeMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IReplacementFeeMaster | null> {
    return await super.delete(id);
  }
  public async getNextReplacementFeeId(): Promise<string> {
    const lastRecord = await ReplacementFeeMaster.findOne({
      feeId: { $regex: /^FEE-/ }
    })
      .sort({ createdAt: -1, _id: -1 })
      .lean();
    let nextNumber = 1;
    if (lastRecord && lastRecord.feeId) {
      const parts = lastRecord.feeId.split("-");
      if (parts.length === 2 && !isNaN(Number(parts[1]))) {
        nextNumber = Number(parts[1]) + 1;
      }
    }
    return `FEE-${String(nextNumber).padStart(6, "0")}`;
  }
}
