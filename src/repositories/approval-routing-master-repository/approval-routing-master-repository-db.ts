import { IApprovalRoutingMaster } from "@/schemas/approval-routing-master-schema";
import ApprovalRoutingMaster from "@/schemas/approval-routing-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ApprovalRoutingMasterRepository,
  GetAllApprovalRoutingMasterOptions,
} from "./approval-routing-master-repository";

export class ApprovalRoutingMasterRepositoryDb
  extends MongoRepository<IApprovalRoutingMaster>
  implements ApprovalRoutingMasterRepository
{
  public constructor() {
    super(ApprovalRoutingMaster);
  }

  public async getAll(options: GetAllApprovalRoutingMasterOptions = {}): Promise<IApprovalRoutingMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IApprovalRoutingMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IApprovalRoutingMaster>): Promise<IApprovalRoutingMaster> {
    return await super.create(record as IApprovalRoutingMaster);
  }

  public async Update(record: Partial<IApprovalRoutingMaster>): Promise<IApprovalRoutingMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IApprovalRoutingMaster | null> {
    return await super.delete(id);
  }
}
