import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleGuardAccountMappingMasterService } from "./get-single-guard-account-mapping-master-service";
import { getSessionService } from "@/services/get-session-service";
import { guardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

export const getSingleGuardAccountMappingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleGuardAccountMappingMasterService({
    guardAccountMappingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-guard-account-mapping-master-service";
