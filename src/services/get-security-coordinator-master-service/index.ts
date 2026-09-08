import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSecurityCoordinatorMasterService } from "./get-security-coordinator-master-service";
import { getSessionService } from "@/services/get-session-service";
import { securityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

export const getSecurityCoordinatorMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSecurityCoordinatorMasterService({
    securityCoordinatorMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-security-coordinator-master-service";
