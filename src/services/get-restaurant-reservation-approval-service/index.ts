import { AccessMediatorService } from "@/services/access-mediator-service";
import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { GetRestaurantReservationApprovalService } from "./get-restaurant-reservation-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./get-restaurant-reservation-approval-service";

export const getRestaurantReservationApprovalService = new AccessMediatorService({
  getSessionService,
  service: new GetRestaurantReservationApprovalService({
    restaurantReservationApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
