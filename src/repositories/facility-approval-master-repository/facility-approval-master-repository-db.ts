import { IFacilityApprovalMaster } from "@/schemas/facility-approval-master-schema";
import FacilityApprovalMaster from "@/schemas/facility-approval-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  FacilityApprovalMasterRepository,
  GetAllFacilityApprovalMasterOptions,
} from "./facility-approval-master-repository";

export class FacilityApprovalMasterRepositoryDb
  extends MongoRepository<IFacilityApprovalMaster>
  implements FacilityApprovalMasterRepository
{
  public constructor() {
    super(FacilityApprovalMaster);
  }

  public async getAll(
    options: GetAllFacilityApprovalMasterOptions = {}
  ): Promise<IFacilityApprovalMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IFacilityApprovalMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(
    record: Partial<IFacilityApprovalMaster>
  ): Promise<IFacilityApprovalMaster> {
    return await super.create(record as IFacilityApprovalMaster);
  }

  public async Update(
    record: Partial<IFacilityApprovalMaster>
  ): Promise<IFacilityApprovalMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IFacilityApprovalMaster | null> {
    return await super.delete(id);
  }
}