import { IApprovalRoutingMaster } from "@/schemas/approval-routing-master-schema";

export type GetAllApprovalRoutingMasterOptions = {
  isArchived?: boolean;
};

export abstract class ApprovalRoutingMasterRepository {
  public abstract getAll(options?: GetAllApprovalRoutingMasterOptions): Promise<IApprovalRoutingMaster[]>;
  public abstract get(id: string): Promise<IApprovalRoutingMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IApprovalRoutingMaster>): Promise<IApprovalRoutingMaster>;
  public abstract Update(record: Partial<IApprovalRoutingMaster>): Promise<IApprovalRoutingMaster | undefined>;
  public abstract delete(id: string): Promise<IApprovalRoutingMaster | null>;
}
