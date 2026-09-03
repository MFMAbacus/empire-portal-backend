import { IResidentMaster } from "@/schemas/resident-master-schema";
import ResidentMaster from "@/schemas/resident-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ResidentMasterRepository,
  GetAllResidentMasterOptions,
} from "./resident-master-repository";

export class ResidentMasterRepositoryDb
  extends MongoRepository<IResidentMaster>
  implements ResidentMasterRepository
{
  public constructor() {
    super(ResidentMaster);
  }

  public async getAll(options: GetAllResidentMasterOptions = {}): Promise<IResidentMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IResidentMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IResidentMaster>): Promise<IResidentMaster> {
    return await super.create(record as IResidentMaster);
  }

  public async Update(record: Partial<IResidentMaster>): Promise<IResidentMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IResidentMaster | null> {
    return await super.delete(id);
  }
}
