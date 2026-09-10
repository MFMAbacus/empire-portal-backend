import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateMovementRuleMasterService } from "./create-movement-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

export const createMovementRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateMovementRuleMasterService({
    movementRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-movement-rule-master-service";
