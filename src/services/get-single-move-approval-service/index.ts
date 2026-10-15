import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetSingleMoveApprovalService } from "./get-single-move-approval-service";
import { getSessionService } from "@/services/get-session-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const getSingleMoveApprovalService = new AccessMediatorService({
  getSessionService,
  service: new GetSingleMoveApprovalService({
    moveApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./get-single-move-approval-service";
