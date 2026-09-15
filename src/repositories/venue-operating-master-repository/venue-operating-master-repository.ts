import { IVenueOperatingMaster } from "@/schemas/venue-operating-master-schema";

export type GetAllVenueOperatingMasterOptions = {
  isArchived?: boolean;
};

export abstract class VenueOperatingMasterRepository {
  public abstract getAll(options?: GetAllVenueOperatingMasterOptions): Promise<IVenueOperatingMaster[]>;
  public abstract get(id: string): Promise<IVenueOperatingMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IVenueOperatingMaster>): Promise<IVenueOperatingMaster>;
  public abstract Update(record: Partial<IVenueOperatingMaster>): Promise<IVenueOperatingMaster | undefined>;
  public abstract delete(id: string): Promise<IVenueOperatingMaster | null>;
}
