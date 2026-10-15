import { AccessMediatorService } from "@/services/access-mediator-service";
import { UpdateMoveApprovalService } from "./update-move-approval-service";
import { getSessionService } from "@/services/get-session-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const updateMoveApprovalService = new AccessMediatorService({
  getSessionService,
  service: new UpdateMoveApprovalService({
    moveApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./update-move-approval-service";
