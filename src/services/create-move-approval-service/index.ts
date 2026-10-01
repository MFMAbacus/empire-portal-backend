import { CreateMoveApprovalService } from "./create-move-approval-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const createMoveApprovalService = new CreateMoveApprovalService({
  moveApprovalRepository,
});

export * from "./create-move-approval-service";
