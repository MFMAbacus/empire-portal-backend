import { AccessMediatorService } from "@/services/access-mediator-service";
import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { CreateRestaurantReservationApprovalService } from "./create-restaurant-reservation-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./create-restaurant-reservation-approval-service";

export const createRestaurantReservationApprovalService = new AccessMediatorService({
  getSessionService,
  service: new CreateRestaurantReservationApprovalService({
    restaurantReservationApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
