import { ICourtBlockingMaster } from "@/schemas/court-blocking-master-schema";

export type GetAllCourtBlockingMasterOptions = {
  isArchived?: boolean;
};

export abstract class CourtBlockingMasterRepository {
  public abstract getAll(options?: GetAllCourtBlockingMasterOptions): Promise<ICourtBlockingMaster[]>;
  public abstract get(id: string): Promise<ICourtBlockingMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ICourtBlockingMaster>): Promise<ICourtBlockingMaster>;
  public abstract Update(record: Partial<ICourtBlockingMaster>): Promise<ICourtBlockingMaster | undefined>;
  public abstract delete(id: string): Promise<ICourtBlockingMaster | null>;
}
