import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleFacilityApprovalMasterService } from "./get-single-facility-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { facilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

export const getSingleFacilityApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleFacilityApprovalMasterService({
    facilityApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-facility-approval-master-service";
