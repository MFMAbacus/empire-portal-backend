import { ICourtOperatingMaster } from "@/schemas/court-operating-master-schema";
import CourtOperatingMaster from "@/schemas/court-operating-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CourtOperatingMasterRepository,
  GetAllCourtOperatingMasterOptions,
} from "./court-operating-master-repository";

export class CourtOperatingMasterRepositoryDb
  extends MongoRepository<ICourtOperatingMaster>
  implements CourtOperatingMasterRepository
{
  public constructor() {
    super(CourtOperatingMaster);
  }

  public async getAll(options: GetAllCourtOperatingMasterOptions = {}): Promise<ICourtOperatingMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICourtOperatingMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICourtOperatingMaster>): Promise<ICourtOperatingMaster> {
    return await super.create(record as ICourtOperatingMaster);
  }

  public async Update(record: Partial<ICourtOperatingMaster>): Promise<ICourtOperatingMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICourtOperatingMaster | null> {
    return await super.delete(id);
  }
}
