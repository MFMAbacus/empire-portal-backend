import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { GetRestaurantReservationApprovalService } from "./get-restaurant-reservation-approval-service";

export * from "./get-restaurant-reservation-approval-service";

export const getRestaurantReservationApprovalService = new GetRestaurantReservationApprovalService({
  restaurantReservationApprovalRepository,
});
