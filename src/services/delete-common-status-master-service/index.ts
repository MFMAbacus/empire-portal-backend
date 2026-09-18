import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteCommonStatusMasterService } from "./delete-common-status-master-service";
import { getSessionService } from "@/services/get-session-service";
import { commonStatusMasterRepository } from "@/repositories/common-status-master-repository";

export const deleteCommonStatusMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteCommonStatusMasterService({
    commonStatusMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-common-status-master-service";
