import { GetSingleMoveApprovalService } from "./get-single-move-approval-service";
import { moveApprovalRepository } from "@/repositories/move-approval-repository";

export const getSingleMoveApprovalService = new GetSingleMoveApprovalService({
  moveApprovalRepository,
});

export * from "./get-single-move-approval-service";
