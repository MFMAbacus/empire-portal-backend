import { IRestaurantStaffMaster } from "@/schemas/restaurant-staff-master-schema";

export type GetAllRestaurantStaffMasterOptions = {
  isArchived?: boolean;
};

export abstract class RestaurantStaffMasterRepository {
  public abstract getAll(options?: GetAllRestaurantStaffMasterOptions): Promise<IRestaurantStaffMaster[]>;
  public abstract get(id: string): Promise<IRestaurantStaffMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IRestaurantStaffMaster>): Promise<IRestaurantStaffMaster>;
  public abstract Update(record: Partial<IRestaurantStaffMaster>): Promise<IRestaurantStaffMaster | undefined>;
  public abstract delete(id: string): Promise<IRestaurantStaffMaster | null>;
}
