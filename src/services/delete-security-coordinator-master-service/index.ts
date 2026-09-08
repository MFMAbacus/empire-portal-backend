import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteSecurityCoordinatorMasterService } from "./delete-security-coordinator-master-service";
import { getSessionService } from "@/services/get-session-service";
import { securityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

export const deleteSecurityCoordinatorMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteSecurityCoordinatorMasterService({
    securityCoordinatorMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-security-coordinator-master-service";
