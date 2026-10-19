import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateCourtApprovalService } from "./update-court-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./update-court-approval-service";

export const updateCourtApprovalService = new AccessMediatorService({
  getSessionService,
  service: new UpdateCourtApprovalService(),
  roles: ["manager", "staff", "customer"],
});

export default updateCourtApprovalService;
