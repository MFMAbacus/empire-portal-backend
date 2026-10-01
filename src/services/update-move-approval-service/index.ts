import { UpdateMoveApprovalService } from "./update-move-approval-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const updateMoveApprovalService = new UpdateMoveApprovalService({
  moveApprovalRepository,
});

export * from "./update-move-approval-service";
