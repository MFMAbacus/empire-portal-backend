import { IPropertyManagementApprovalMaster } from "@/schemas/property-management-approval-master-schema";

export type GetAllPropertyManagementApprovalMasterOptions = {
  isArchived?: boolean;
};

export abstract class PropertyManagementApprovalMasterRepository {
  public abstract getAll(options?: GetAllPropertyManagementApprovalMasterOptions): Promise<IPropertyManagementApprovalMaster[]>;
  public abstract get(id: string): Promise<IPropertyManagementApprovalMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IPropertyManagementApprovalMaster>): Promise<IPropertyManagementApprovalMaster>;
  public abstract Update(record: Partial<IPropertyManagementApprovalMaster>): Promise<IPropertyManagementApprovalMaster | undefined>;
  public abstract delete(id: string): Promise<IPropertyManagementApprovalMaster | null>;
}
