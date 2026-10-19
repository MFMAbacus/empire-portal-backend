import { AccessMediatorService } from "@/services/access-mediator-service";
import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { UpdateRestaurantReservationApprovalService } from "./update-restaurant-reservation-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./update-restaurant-reservation-approval-service";

export const updateRestaurantReservationApprovalService = new AccessMediatorService({
  getSessionService,
  service: new UpdateRestaurantReservationApprovalService({
    restaurantReservationApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
