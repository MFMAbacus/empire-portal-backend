import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleMovementRuleMasterService } from "./get-single-movement-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

export const getSingleMovementRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleMovementRuleMasterService({
    movementRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-movement-rule-master-service";
