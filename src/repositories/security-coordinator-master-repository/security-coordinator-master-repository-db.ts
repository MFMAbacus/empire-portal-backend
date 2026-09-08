import { ISecurityCoordinatorMaster } from "@/schemas/security-coordinator-master-schema";
import SecurityCoordinatorMaster from "@/schemas/security-coordinator-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  SecurityCoordinatorMasterRepository,
  GetAllSecurityCoordinatorMasterOptions,
} from "./security-coordinator-master-repository";

export class SecurityCoordinatorMasterRepositoryDb
  extends MongoRepository<ISecurityCoordinatorMaster>
  implements SecurityCoordinatorMasterRepository
{
  public constructor() {
    super(SecurityCoordinatorMaster);
  }

  public async getAll(
    options: GetAllSecurityCoordinatorMasterOptions = {}
  ): Promise<ISecurityCoordinatorMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ISecurityCoordinatorMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(
    record: Partial<ISecurityCoordinatorMaster>
  ): Promise<ISecurityCoordinatorMaster> {
    return await super.create(record as ISecurityCoordinatorMaster);
  }

  public async Update(
    record: Partial<ISecurityCoordinatorMaster>
  ): Promise<ISecurityCoordinatorMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ISecurityCoordinatorMaster | null> {
    return await super.delete(id);
  }
}