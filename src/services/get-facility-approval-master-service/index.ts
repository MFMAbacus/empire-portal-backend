import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetFacilityApprovalMasterService } from "./get-facility-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { facilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

export const getFacilityApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetFacilityApprovalMasterService({
    facilityApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-facility-approval-master-service";
