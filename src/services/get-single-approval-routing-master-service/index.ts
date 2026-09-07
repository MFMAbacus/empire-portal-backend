import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleApprovalRoutingMasterService } from "./get-single-approval-routing-master-service";
import { getSessionService } from "@/services/get-session-service";
import { approvalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

export const getSingleApprovalRoutingMasterService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleApprovalRoutingMasterService({
    approvalRoutingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-approval-routing-master-service";
