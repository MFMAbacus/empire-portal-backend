import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetApprovalRoutingMasterService } from "./get-approval-routing-master-service";
import { getSessionService } from "@/services/get-session-service";
import { approvalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

export const getApprovalRoutingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetApprovalRoutingMasterService({
    approvalRoutingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-approval-routing-master-service";
