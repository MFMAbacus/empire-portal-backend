import { AccessMediatorService } from "@/services/access-mediator-service";
import { restaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { GetSingleRestaurantReservationApprovalService } from "./get-single-restaurant-reservation-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./get-single-restaurant-reservation-approval-service";

export const getSingleRestaurantReservationApprovalService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleRestaurantReservationApprovalService({
    restaurantReservationApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
