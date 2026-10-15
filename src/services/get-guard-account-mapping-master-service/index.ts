import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetGuardAccountMappingMasterService } from "./get-guard-account-mapping-master-service";
import { getSessionService } from "@/services/get-session-service";
import { guardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";
import { GetMobileGuardAccountMappingMasterService } from "./get-mobile-guard-account-mapping-master-service";

export const getGuardAccountMappingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetGuardAccountMappingMasterService({
    guardAccountMappingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});
export const getMobileGuardAccountMappingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetMobileGuardAccountMappingMasterService(),
  roles: ["manager", "staff", "customer"],
});
export * from "./get-guard-account-mapping-master-service";
export * from "./get-mobile-guard-account-mapping-master-service";
