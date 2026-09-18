import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleRestaurantStaffMasterService } from "./get-single-restaurant-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { restaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

export const getSingleRestaurantStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleRestaurantStaffMasterService({
    restaurantStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-restaurant-staff-master-service";
