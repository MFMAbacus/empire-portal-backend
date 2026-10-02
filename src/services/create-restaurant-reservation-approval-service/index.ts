import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { CreateRestaurantReservationApprovalService } from "./create-restaurant-reservation-approval-service";

export * from "./create-restaurant-reservation-approval-service";

export const createRestaurantReservationApprovalService = new CreateRestaurantReservationApprovalService({
  restaurantReservationApprovalRepository,
});
