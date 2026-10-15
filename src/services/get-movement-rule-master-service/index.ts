import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetMovementRuleMasterService } from "./get-movement-rule-master-service";
import { getSessionService } from "@/services/get-session-service";
import { movementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";
import { GetMobileMovementRuleMasterService } from "./get-mobile-movement-rule-master-service";
import e from "express";

export const getMovementRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMovementRuleMasterService({
    movementRuleMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileMovementRuleMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileMovementRuleMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-movement-rule-master-service";
export * from "./get-mobile-movement-rule-master-service";