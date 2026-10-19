import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetCourtApprovalService } from "./get-court-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./get-court-approval-service";

export const getCourtApprovalService = new AccessMediatorService({
  getSessionService,
  service: new GetCourtApprovalService(),
  roles: ["manager", "staff", "customer"],
});

export default getCourtApprovalService;
