import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCommonStatusMasterService } from "./create-common-status-master-service";
import { getSessionService } from "@/services/get-session-service";
import { commonStatusMasterRepository } from "@/repositories/common-status-master-repository";

export const createCommonStatusMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateCommonStatusMasterService({
    commonStatusMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-common-status-master-service";
