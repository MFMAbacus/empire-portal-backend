import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateRestaurantStaffMasterService } from "./create-restaurant-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { restaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

export const createRestaurantStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateRestaurantStaffMasterService({
    restaurantStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-restaurant-staff-master-service";
