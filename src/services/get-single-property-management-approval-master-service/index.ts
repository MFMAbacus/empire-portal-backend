import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSinglePropertyManagementApprovalMasterService } from "./get-single-property-management-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

export const getSinglePropertyManagementApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSinglePropertyManagementApprovalMasterService({
    propertyManagementApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-property-management-approval-master-service";
