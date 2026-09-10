import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetMovementRuleMasterService } from "./get-movement-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

export const getMovementRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMovementRuleMasterService({
    movementRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-movement-rule-master-service";
