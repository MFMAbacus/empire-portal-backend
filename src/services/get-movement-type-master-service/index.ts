import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetMovementTypeMasterService } from "./get-movement-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

export const getMovementTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMovementTypeMasterService({
    movementTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-movement-type-master-service";
