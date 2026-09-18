import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateRestaurantStaffMasterService } from "./update-restaurant-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { restaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

export const updateRestaurantStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateRestaurantStaffMasterService({
    restaurantStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-restaurant-staff-master-service";
