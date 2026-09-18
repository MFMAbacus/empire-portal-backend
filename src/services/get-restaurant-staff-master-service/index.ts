import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetRestaurantStaffMasterService } from "./get-restaurant-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { restaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

export const getRestaurantStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetRestaurantStaffMasterService({
    restaurantStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-restaurant-staff-master-service";
