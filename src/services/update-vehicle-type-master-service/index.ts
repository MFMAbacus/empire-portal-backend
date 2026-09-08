import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateVehicleTypeMasterService } from "./update-vehicle-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { vehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

export const updateVehicleTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateVehicleTypeMasterService({
    vehicleTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-vehicle-type-master-service";
