import { ICourtBookingMaster } from "@/schemas/court-booking-master-schema";

export type GetAllCourtBookingMasterOptions = {
  isArchived?: boolean;
};

export abstract class CourtBookingMasterRepository {
  public abstract getAll(options?: GetAllCourtBookingMasterOptions): Promise<ICourtBookingMaster[]>;
  public abstract get(id: string): Promise<ICourtBookingMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ICourtBookingMaster>): Promise<ICourtBookingMaster>;
  public abstract Update(record: Partial<ICourtBookingMaster>): Promise<ICourtBookingMaster | undefined>;
  public abstract delete(id: string): Promise<ICourtBookingMaster | null>;
}
