import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCommonStatusMasterService } from "./update-common-status-master-service";
import { getSessionService } from "@/services/get-session-service";
import { commonStatusMasterRepository } from "@/repositories/common-status-master-repository";

export const updateCommonStatusMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCommonStatusMasterService({
    commonStatusMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-common-status-master-service";
