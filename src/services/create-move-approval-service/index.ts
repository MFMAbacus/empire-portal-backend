import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateMoveApprovalService } from "./create-move-approval-service";
import { getSessionService } from "@/services/get-session-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const createMoveApprovalService = new AccessMediatorService({
  getSessionService,
  service: new CreateMoveApprovalService({
    moveApprovalRepository,
  }),
  roles: ["manager", "staff", "customer"],
});

export * from "./create-move-approval-service";
