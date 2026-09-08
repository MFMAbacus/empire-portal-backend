import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateVehicleTypeMasterService } from "./create-vehicle-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { vehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

export const createVehicleTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateVehicleTypeMasterService({
    vehicleTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-vehicle-type-master-service";
