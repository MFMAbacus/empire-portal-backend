import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateSecurityCoordinatorMasterService } from "./update-security-coordinator-master-service";
import { getSessionService } from "@/services/get-session-service";
import { securityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

export const updateSecurityCoordinatorMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateSecurityCoordinatorMasterService({
    securityCoordinatorMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-security-coordinator-master-service";
