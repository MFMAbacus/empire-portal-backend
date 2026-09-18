import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCommonStatusMasterService } from "./get-single-common-status-master-service";
import { getSessionService } from "@/services/get-session-service";
import { commonStatusMasterRepository } from "@/repositories/common-status-master-repository";

export const getSingleCommonStatusMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCommonStatusMasterService({
    commonStatusMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-common-status-master-service";
