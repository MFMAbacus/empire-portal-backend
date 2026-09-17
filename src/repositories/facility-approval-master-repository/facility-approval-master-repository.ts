import { IFacilityApprovalMaster } from "@/schemas/facility-approval-master-schema";

export type GetAllFacilityApprovalMasterOptions = {
  isArchived?: boolean;
};

export abstract class FacilityApprovalMasterRepository {
  public abstract getAll(options?: GetAllFacilityApprovalMasterOptions): Promise<IFacilityApprovalMaster[]>;
  public abstract get(id: string): Promise<IFacilityApprovalMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IFacilityApprovalMaster>): Promise<IFacilityApprovalMaster>;
  public abstract Update(record: Partial<IFacilityApprovalMaster>): Promise<IFacilityApprovalMaster | undefined>;
  public abstract delete(id: string): Promise<IFacilityApprovalMaster | null>;
}
