import { IResidentMaster } from "@/schemas/resident-master-schema";

export type GetAllResidentMasterOptions = {
  isArchived?: boolean;
};

export abstract class ResidentMasterRepository {
  public abstract getAll(options?: GetAllResidentMasterOptions): Promise<IResidentMaster[]>;
  public abstract get(id: string): Promise<IResidentMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IResidentMaster>): Promise<IResidentMaster>;
  public abstract Update(record: Partial<IResidentMaster>): Promise<IResidentMaster | undefined>;
  public abstract delete(id: string): Promise<IResidentMaster | null>;
}
