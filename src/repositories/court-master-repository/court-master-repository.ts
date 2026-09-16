import { ICourtMaster } from "@/schemas/court-master-schema";

export type GetAllCourtMasterOptions = {
  isArchived?: boolean;
};

export abstract class CourtMasterRepository {
  public abstract getAll(options?: GetAllCourtMasterOptions): Promise<ICourtMaster[]>;
  public abstract get(id: string): Promise<ICourtMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ICourtMaster>): Promise<ICourtMaster>;
  public abstract Update(record: Partial<ICourtMaster>): Promise<ICourtMaster | undefined>;
  public abstract delete(id: string): Promise<ICourtMaster | null>;
}
