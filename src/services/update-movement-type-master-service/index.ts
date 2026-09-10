import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateMovementTypeMasterService } from "./update-movement-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

export const updateMovementTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateMovementTypeMasterService({
    movementTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-movement-type-master-service";
