import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetPropertyManagementApprovalMasterService } from "./get-property-management-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

export const getPropertyManagementApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetPropertyManagementApprovalMasterService({
    propertyManagementApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-property-management-approval-master-service";
