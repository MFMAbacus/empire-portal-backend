import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateGuardAccountMappingMasterService } from "./update-guard-account-mapping-master-service";
import { getSessionService } from "@/services/get-session-service";
import { guardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

export const updateGuardAccountMappingMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateGuardAccountMappingMasterService({
    guardAccountMappingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-guard-account-mapping-master-service";
