import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetMovementTypeMasterService } from "./get-movement-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementTypeMasterRepository } from "@/repositories/movement-type-master-repository";
import { GetMobileMovementTypeMasterService } from "./get-mobile-movement-type-master-service";

export const getMovementTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMovementTypeMasterService({
    movementTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileMovementTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileMovementTypeMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-movement-type-master-service";
export * from "./get-mobile-movement-type-master-service";