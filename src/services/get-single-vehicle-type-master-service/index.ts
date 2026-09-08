import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleVehicleTypeMasterService } from "./get-single-vehicle-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { vehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

export const getSingleVehicleTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleVehicleTypeMasterService({
    vehicleTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-vehicle-type-master-service";
