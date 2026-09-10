import { IPropertyManagementApprovalMaster } from "@/schemas/property-management-approval-master-schema";
import PropertyManagementApprovalMaster from "@/schemas/property-management-approval-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  PropertyManagementApprovalMasterRepository,
  GetAllPropertyManagementApprovalMasterOptions,
} from "./property-management-approval-master-repository";

export class PropertyManagementApprovalMasterRepositoryDb
  extends MongoRepository<IPropertyManagementApprovalMaster>
  implements PropertyManagementApprovalMasterRepository
{
  public constructor() {
    super(PropertyManagementApprovalMaster);
  }

  public async getAll(
    options: GetAllPropertyManagementApprovalMasterOptions = {}
  ): Promise<IPropertyManagementApprovalMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IPropertyManagementApprovalMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(
    record: Partial<IPropertyManagementApprovalMaster>
  ): Promise<IPropertyManagementApprovalMaster> {
    return await super.create(record as IPropertyManagementApprovalMaster);
  }

  public async Update(
    record: Partial<IPropertyManagementApprovalMaster>
  ): Promise<IPropertyManagementApprovalMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IPropertyManagementApprovalMaster | null> {
    return await super.delete(id);
  }
}