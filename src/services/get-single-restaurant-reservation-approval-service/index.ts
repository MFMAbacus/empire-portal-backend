import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { GetSingleRestaurantReservationApprovalService } from "./get-single-restaurant-reservation-approval-service";

export * from "./get-single-restaurant-reservation-approval-service";

export const getSingleRestaurantReservationApprovalService = new GetSingleRestaurantReservationApprovalService({
  restaurantReservationApprovalRepository,
});
