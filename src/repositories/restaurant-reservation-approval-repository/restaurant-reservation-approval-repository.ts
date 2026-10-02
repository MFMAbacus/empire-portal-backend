import { IRestaurantReservationApproval } from "@/schemas/restaurant-reservation-approval-schema";

export type GetAllRestaurantReservationApprovalOptions = {
  isArchived?: boolean;
  residentId?: string;
  venueId?: string;
  projectCode?: string;
};

export interface RestaurantReservationApprovalRepository {
  getAll(options?: GetAllRestaurantReservationApprovalOptions): Promise<IRestaurantReservationApproval[]>;
  get(id: string): Promise<IRestaurantReservationApproval | undefined>;
  exists(id: string): Promise<boolean>;
  Create(record: IRestaurantReservationApproval): Promise<void>;
  Update(record: Partial<IRestaurantReservationApproval>): Promise<IRestaurantReservationApproval | undefined>;
  delete(id: string): Promise<IRestaurantReservationApproval | null>;
}
