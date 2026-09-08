import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateSecurityCoordinatorMasterService } from "./create-security-coordinator-master-service";
import { getSessionService } from "@/services/get-session-service";
import { securityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

export const createSecurityCoordinatorMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateSecurityCoordinatorMasterService({
    securityCoordinatorMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-security-coordinator-master-service";
