import CourtBlockingMaster, { ICourtBlockingMaster } from "@/schemas/court-blocking-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CourtBlockingMasterRepository,
  GetAllCourtBlockingMasterOptions,
} from "./court-blocking-master-repository";
import GateMaster from "@/schemas/gate-master-schema/gate-master-schema";

export class CourtBlockingMasterRepositoryDb
  extends MongoRepository<ICourtBlockingMaster>
  implements CourtBlockingMasterRepository
{
  public constructor() {
    super(CourtBlockingMaster);
  }

  public async getAll(options: GetAllCourtBlockingMasterOptions = {}): Promise<ICourtBlockingMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICourtBlockingMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICourtBlockingMaster>): Promise<ICourtBlockingMaster> {
    return await super.create(record as ICourtBlockingMaster);
  }

  public async Update(record: Partial<ICourtBlockingMaster>): Promise<ICourtBlockingMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICourtBlockingMaster | null> {
    return await super.delete(id);
  }
   public async getNextBlockId(): Promise<string> {
      const lastRecord = await CourtBlockingMaster.findOne({
        gateId: { $regex: /^CB-/ }
      })
        .sort({ createdAt: -1, _id: -1 })
        .lean();
      let nextNumber = 1;
      if (lastRecord && lastRecord.blockId) {
        const parts = lastRecord.blockId.split("-");
        if (parts.length === 2 && !isNaN(Number(parts[1]))) {
          nextNumber = Number(parts[1]) + 1;
        }
      }
      return `CB-${String(nextNumber).padStart(6, "0")}`;
    }  
}
