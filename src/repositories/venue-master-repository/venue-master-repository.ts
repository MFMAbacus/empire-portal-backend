import { IVenueMaster } from "@/schemas/venue-master-schema";

export type GetAllVenueMasterOptions = {
  isArchived?: boolean;
};

export abstract class VenueMasterRepository {
  public abstract getAll(options?: GetAllVenueMasterOptions): Promise<IVenueMaster[]>;
  public abstract get(id: string): Promise<IVenueMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IVenueMaster>): Promise<IVenueMaster>;
  public abstract Update(record: Partial<IVenueMaster>): Promise<IVenueMaster | undefined>;
  public abstract delete(id: string): Promise<IVenueMaster | null>;
}
