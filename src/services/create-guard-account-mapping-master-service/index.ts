import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateGuardAccountMappingMasterService } from "./create-guard-account-mapping-master-service";
import { getSessionService } from "@/services/get-session-service";
import { guardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

export const createGuardAccountMappingMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateGuardAccountMappingMasterService({
    guardAccountMappingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-guard-account-mapping-master-service";
