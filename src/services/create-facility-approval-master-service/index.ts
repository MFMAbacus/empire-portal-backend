import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateFacilityApprovalMasterService } from "./create-facility-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { facilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

export const createFacilityApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateFacilityApprovalMasterService({
    facilityApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-facility-approval-master-service";
