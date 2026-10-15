import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetMoveApprovalService } from "./get-move-approval-service";
import { getSessionService } from "@/services/get-session-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const getMoveApprovalService = new AccessMediatorService({
  getSessionService,
  service: new GetMoveApprovalService({
    moveApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-move-approval-service";
