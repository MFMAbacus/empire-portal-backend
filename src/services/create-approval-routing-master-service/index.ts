import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateApprovalRoutingMasterService } from "./create-approval-routing-master-service";
import { getSessionService } from "@/services/get-session-service";
import { approvalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

export const createApprovalRoutingMasterService = new AccessMediatorService({
  getSessionService,
  service: new CreateApprovalRoutingMasterService({
    approvalRoutingMasterRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-approval-routing-master-service";
