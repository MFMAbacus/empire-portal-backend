import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateCourtApprovalService } from "./create-court-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./create-court-approval-service";

export const createCourtApprovalService = new AccessMediatorService({
  getSessionService,
  service: new CreateCourtApprovalService(),
  roles: ["manager", "staff", "customer"],
});

export default createCourtApprovalService;
