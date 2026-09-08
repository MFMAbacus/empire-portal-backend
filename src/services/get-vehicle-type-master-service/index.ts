import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetVehicleTypeMasterService } from "./get-vehicle-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { vehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

export const getVehicleTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetVehicleTypeMasterService({
    vehicleTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-vehicle-type-master-service";
