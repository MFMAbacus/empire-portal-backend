import { IGuardAccountMappingMaster } from "@/schemas/guard-account-mapping-master-schema";
import GuardAccountMappingMaster from "@/schemas/guard-account-mapping-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  GuardAccountMappingMasterRepository,
  GetAllGuardAccountMappingMasterOptions,
} from "./guard-account-mapping-master-repository";

export class GuardAccountMappingMasterRepositoryDb
  extends MongoRepository<IGuardAccountMappingMaster>
  implements GuardAccountMappingMasterRepository
{
  public constructor() {
    super(GuardAccountMappingMaster);
  }

  public async getAll(options: GetAllGuardAccountMappingMasterOptions = {}): Promise<IGuardAccountMappingMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IGuardAccountMappingMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IGuardAccountMappingMaster>): Promise<IGuardAccountMappingMaster> {
    return await super.create(record as IGuardAccountMappingMaster);
  }

  public async Update(record: Partial<IGuardAccountMappingMaster>): Promise<IGuardAccountMappingMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IGuardAccountMappingMaster | null> {
    return await super.delete(id);
  }
}
