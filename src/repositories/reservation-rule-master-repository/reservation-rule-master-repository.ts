import { IReservationRuleMaster } from "@/schemas/reservation-rule-master-schema";

export type GetAllReservationRuleMasterOptions = {
  isArchived?: boolean;
};

export abstract class ReservationRuleMasterRepository {
  public abstract getAll(options?: GetAllReservationRuleMasterOptions): Promise<IReservationRuleMaster[]>;
  public abstract get(id: string): Promise<IReservationRuleMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IReservationRuleMaster>): Promise<IReservationRuleMaster>;
  public abstract Update(record: Partial<IReservationRuleMaster>): Promise<IReservationRuleMaster | undefined>;
  public abstract delete(id: string): Promise<IReservationRuleMaster | null>;
}
