import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateMovementTypeMasterService } from "./create-movement-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

export const createMovementTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateMovementTypeMasterService({
    movementTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-movement-type-master-service";
