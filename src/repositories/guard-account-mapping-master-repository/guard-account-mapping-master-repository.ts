import { IGuardAccountMappingMaster } from "@/schemas/guard-account-mapping-master-schema";

export type GetAllGuardAccountMappingMasterOptions = {
  isArchived?: boolean;
};

export abstract class GuardAccountMappingMasterRepository {
  public abstract getAll(options?: GetAllGuardAccountMappingMasterOptions): Promise<IGuardAccountMappingMaster[]>;
  public abstract get(id: string): Promise<IGuardAccountMappingMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IGuardAccountMappingMaster>): Promise<IGuardAccountMappingMaster>;
  public abstract Update(record: Partial<IGuardAccountMappingMaster>): Promise<IGuardAccountMappingMaster | undefined>;
  public abstract delete(id: string): Promise<IGuardAccountMappingMaster | null>;
}
