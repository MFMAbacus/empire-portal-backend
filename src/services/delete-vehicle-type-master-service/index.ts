import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteVehicleTypeMasterService } from "./delete-vehicle-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { vehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

export const deleteVehicleTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteVehicleTypeMasterService({
    vehicleTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-vehicle-type-master-service";
