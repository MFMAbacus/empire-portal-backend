import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleCourtApprovalService } from "./get-single-court-approval-service";
import { getSessionService } from "@/services/get-session-service";

export * from "./get-single-court-approval-service";

export const getSingleCourtApprovalService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleCourtApprovalService(),
  roles: ["manager", "staff", "customer"],
});

export default getSingleCourtApprovalService;
