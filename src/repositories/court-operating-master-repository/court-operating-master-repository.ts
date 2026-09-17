import { ICourtOperatingMaster } from "@/schemas/court-operating-master-schema";

export type GetAllCourtOperatingMasterOptions = {
  isArchived?: boolean;
};

export abstract class CourtOperatingMasterRepository {
  public abstract getAll(options?: GetAllCourtOperatingMasterOptions): Promise<ICourtOperatingMaster[]>;
  public abstract get(id: string): Promise<ICourtOperatingMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ICourtOperatingMaster>): Promise<ICourtOperatingMaster>;
  public abstract Update(record: Partial<ICourtOperatingMaster>): Promise<ICourtOperatingMaster | undefined>;
  public abstract delete(id: string): Promise<ICourtOperatingMaster | null>;
}
