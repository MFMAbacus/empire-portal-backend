import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteGuardAccountMappingMasterService } from "./delete-guard-account-mapping-master-service";
import { getSessionService } from "@/services/get-session-service";
import { guardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

export const deleteGuardAccountMappingMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteGuardAccountMappingMasterService({
    guardAccountMappingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-guard-account-mapping-master-service";
