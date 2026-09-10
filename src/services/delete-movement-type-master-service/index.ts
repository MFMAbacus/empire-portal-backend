import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteMovementTypeMasterService } from "./delete-movement-type-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

export const deleteMovementTypeMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteMovementTypeMasterService({
    movementTypeMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-movement-type-master-service";
