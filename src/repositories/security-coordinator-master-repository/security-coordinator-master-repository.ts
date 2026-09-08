import { ISecurityCoordinatorMaster } from "@/schemas/security-coordinator-master-schema";

export type GetAllSecurityCoordinatorMasterOptions = {
  isArchived?: boolean;
};

export abstract class SecurityCoordinatorMasterRepository {
  public abstract getAll(options?: GetAllSecurityCoordinatorMasterOptions): Promise<ISecurityCoordinatorMaster[]>;
  public abstract get(id: string): Promise<ISecurityCoordinatorMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ISecurityCoordinatorMaster>): Promise<ISecurityCoordinatorMaster>;
  public abstract Update(record: Partial<ISecurityCoordinatorMaster>): Promise<ISecurityCoordinatorMaster | undefined>;
  public abstract delete(id: string): Promise<ISecurityCoordinatorMaster | null>;
}
