import { IAccessCardStaffMaster } from "@/schemas/access-card-staff-master-schema";
import AccessCardStaffMaster from "@/schemas/access-card-staff-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  AccessCardStaffMasterRepository,
  GetAllAccessCardStaffMasterOptions,
} from "./access-card-staff-master-repository";

export class AccessCardStaffMasterRepositoryDb
  extends MongoRepository<IAccessCardStaffMaster>
  implements AccessCardStaffMasterRepository
{
  public constructor() {
    super(AccessCardStaffMaster);
  }

  public async getAll(
    options: GetAllAccessCardStaffMasterOptions = {}
  ): Promise<IAccessCardStaffMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IAccessCardStaffMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(
    record: Partial<IAccessCardStaffMaster>
  ): Promise<IAccessCardStaffMaster> {
    return await super.create(record as IAccessCardStaffMaster);
  }

  public async Update(
    record: Partial<IAccessCardStaffMaster>
  ): Promise<IAccessCardStaffMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IAccessCardStaffMaster | null> {
    return await super.delete(id);
  }
}