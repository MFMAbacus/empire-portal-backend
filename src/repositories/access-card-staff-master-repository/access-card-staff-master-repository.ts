import { IAccessCardStaffMaster } from "@/schemas/access-card-staff-master-schema";

export type GetAllAccessCardStaffMasterOptions = {
  isArchived?: boolean;
};

export abstract class AccessCardStaffMasterRepository {
  public abstract getAll(options?: GetAllAccessCardStaffMasterOptions): Promise<IAccessCardStaffMaster[]>;
  public abstract get(id: string): Promise<IAccessCardStaffMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IAccessCardStaffMaster>): Promise<IAccessCardStaffMaster>;
  public abstract Update(record: Partial<IAccessCardStaffMaster>): Promise<IAccessCardStaffMaster | undefined>;
  public abstract delete(id: string): Promise<IAccessCardStaffMaster | null>;
}
