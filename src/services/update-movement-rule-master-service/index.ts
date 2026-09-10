import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateMovementRuleMasterService } from "./update-movement-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

export const updateMovementRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateMovementRuleMasterService({
    movementRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-movement-rule-master-service";
