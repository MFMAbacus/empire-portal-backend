import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCommonStatusMasterService } from "./get-common-status-master-service";
import { getSessionService } from "@/services/get-session-service";
import { commonStatusMasterRepository } from "@/repositories/common-status-master-repository";

export const getCommonStatusMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetCommonStatusMasterService({
    commonStatusMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-common-status-master-service";
