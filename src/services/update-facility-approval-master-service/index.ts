import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateFacilityApprovalMasterService } from "./update-facility-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { facilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

export const updateFacilityApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateFacilityApprovalMasterService({
    facilityApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-facility-approval-master-service";
