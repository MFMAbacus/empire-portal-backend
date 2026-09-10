import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeletePropertyManagementApprovalMasterService } from "./delete-property-management-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

export const deletePropertyManagementApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeletePropertyManagementApprovalMasterService({
    propertyManagementApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-property-management-approval-master-service";
