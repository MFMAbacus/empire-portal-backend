import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteFacilityApprovalMasterService } from "./delete-facility-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { facilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

export const deleteFacilityApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteFacilityApprovalMasterService({
    facilityApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-facility-approval-master-service";
