import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdatePropertyManagementApprovalMasterService } from "./update-property-management-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

export const updatePropertyManagementApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdatePropertyManagementApprovalMasterService({
    propertyManagementApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-property-management-approval-master-service";
