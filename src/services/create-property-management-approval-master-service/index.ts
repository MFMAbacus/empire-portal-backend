import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreatePropertyManagementApprovalMasterService } from "./create-property-management-approval-master-service";
import { getSessionService } from "@/services/get-session-service";
import { propertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

export const createPropertyManagementApprovalMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreatePropertyManagementApprovalMasterService({
    propertyManagementApprovalMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-property-management-approval-master-service";
