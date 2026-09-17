import { ICourtTimeMaster } from "@/schemas/court-time-master-schema";

export type GetAllCourtTimeMasterOptions = {
  isArchived?: boolean;
};

export abstract class CourtTimeMasterRepository {
  public abstract getAll(options?: GetAllCourtTimeMasterOptions): Promise<ICourtTimeMaster[]>;
  public abstract get(id: string): Promise<ICourtTimeMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ICourtTimeMaster>): Promise<ICourtTimeMaster>;
  public abstract Update(record: Partial<ICourtTimeMaster>): Promise<ICourtTimeMaster | undefined>;
  public abstract delete(id: string): Promise<ICourtTimeMaster | null>;
}
