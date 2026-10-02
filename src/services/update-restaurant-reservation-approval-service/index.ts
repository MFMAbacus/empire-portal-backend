import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { UpdateRestaurantReservationApprovalService } from "./update-restaurant-reservation-approval-service";

export * from "./update-restaurant-reservation-approval-service";

export const updateRestaurantReservationApprovalService = new UpdateRestaurantReservationApprovalService({
  restaurantReservationApprovalRepository,
});
