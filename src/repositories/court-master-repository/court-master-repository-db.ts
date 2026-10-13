import { ICourtMaster } from "@/schemas/court-master-schema";
import CourtMaster from "@/schemas/court-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CourtMasterRepository,
  GetAllCourtMasterOptions,
} from "./court-master-repository";

export class CourtMasterRepositoryDb
  extends MongoRepository<ICourtMaster>
  implements CourtMasterRepository
{
  public constructor() {
    super(CourtMaster);
  }

  public async getAll(options: GetAllCourtMasterOptions = {}): Promise<ICourtMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICourtMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICourtMaster>): Promise<ICourtMaster> {
    return await super.create(record as ICourtMaster);
  }

  public async Update(record: Partial<ICourtMaster>): Promise<ICourtMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICourtMaster | null> {
    return await super.delete(id);
  }
  public async getNextCourtId(): Promise<string> {
    const lastRecord = await CourtMaster.findOne({
      courtId: { $regex: /^CRT-/ }
    })
      .sort({ createdAt: -1, _id: -1 })
      .lean();
    let nextNumber = 1;
    if (lastRecord && lastRecord.courtId) {
      const parts = lastRecord.courtId.split("-");
      if (parts.length === 2 && !isNaN(Number(parts[1]))) {
        nextNumber = Number(parts[1]) + 1;
      }
    }
    return `CRT-${String(nextNumber).padStart(6, "0")}`;
  }
}
