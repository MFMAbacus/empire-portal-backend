import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleSecurityCoordinatorMasterService } from "./get-single-security-coordinator-master-service";
import { getSessionService } from "@/services/get-session-service";
import { securityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

export const getSingleSecurityCoordinatorMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleSecurityCoordinatorMasterService({
    securityCoordinatorMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-security-coordinator-master-service";
