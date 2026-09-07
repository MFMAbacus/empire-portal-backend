import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateApprovalRoutingMasterService } from "./update-approval-routing-master-service";
import { getSessionService } from "@/services/get-session-service";
import { approvalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

export const updateApprovalRoutingMasterService = new AccessMediatorService({
  getSessionService,
  service: new UpdateApprovalRoutingMasterService({
    approvalRoutingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-approval-routing-master-service";
