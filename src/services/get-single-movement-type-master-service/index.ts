import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleMovementTypeMasterService } from "./get-single-movement-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

export const getSingleMovementTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleMovementTypeMasterService({
    movementTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-movement-type-master-service";
