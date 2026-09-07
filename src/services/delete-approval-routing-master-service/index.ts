import { AccessMediatorService } from "@/services/access-mediator-service";
import { DeleteApprovalRoutingMasterService } from "./delete-approval-routing-master-service";
import { getSessionService } from "@/services/get-session-service";
import { approvalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

export const deleteApprovalRoutingMasterService = new AccessMediatorService({
  getSessionService,
  service: new DeleteApprovalRoutingMasterService({
    approvalRoutingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./delete-approval-routing-master-service";
