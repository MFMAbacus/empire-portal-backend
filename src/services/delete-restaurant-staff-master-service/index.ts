import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteRestaurantStaffMasterService } from "./delete-restauarnt-staff-master-service";
import { getSessionService } from "@/services/get-session-service";
import { restaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

export const deleteRestaurantStaffMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteRestaurantStaffMasterService({
    restaurantStaffMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-restauarnt-staff-master-service";
