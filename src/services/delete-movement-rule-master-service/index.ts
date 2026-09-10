import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteMovementRuleMasterService } from "./delete-movement-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

export const deleteMovementRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteMovementRuleMasterService({
    movementRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-movement-rule-master-service";
