import { GetMoveApprovalService } from "./get-move-approval-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const getMoveApprovalService = new GetMoveApprovalService({
  moveApprovalRepository,
});

export * from "./get-move-approval-service";
