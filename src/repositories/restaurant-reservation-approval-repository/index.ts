import { RestaurantReservationApprovalRepositoryDb } from "./restaurant-reservation-approval-repository-db";

export * from "./restaurant-reservation-approval-repository";
export * from "./restaurant-reservation-approval-repository-db";

export const restaurantReservationApprovalRepository = new RestaurantReservationApprovalRepositoryDb();
