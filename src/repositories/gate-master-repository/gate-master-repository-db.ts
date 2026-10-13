import { IGateMaster } from "@/schemas/gate-master-schema";
import GateMaster from "@/schemas/gate-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  GateMasterRepository,
  GetAllGateMasterOptions,
} from "./gate-master-repository";
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";

export class GateMasterRepositoryDb
  extends MongoRepository<IGateMaster>
  implements GateMasterRepository
{
  public constructor() {
    super(GateMaster);
  }

  public async getAll(options: GetAllGateMasterOptions = {}): Promise<IGateMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IGateMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IGateMaster>): Promise<IGateMaster> {
    return await super.create(record as IGateMaster);
  }

  public async Update(record: Partial<IGateMaster>): Promise<IGateMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IGateMaster | null> {
    return await super.delete(id);
  }
   public async getNextGateId(): Promise<string> {
      const lastRecord = await GateMaster.findOne({
        gateId: { $regex: /^GTE-/ }
      })
        .sort({ createdAt: -1, _id: -1 })
        .lean();
      let nextNumber = 1;
      if (lastRecord && lastRecord.gateId) {
        const parts = lastRecord.gateId.split("-");
        if (parts.length === 2 && !isNaN(Number(parts[1]))) {
          nextNumber = Number(parts[1]) + 1;
        }
      }
      return `GTE-${String(nextNumber).padStart(6, "0")}`;
    } 
}
