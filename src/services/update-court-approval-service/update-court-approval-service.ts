import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { courtApprovalRepository } from "@/repositories/court-approval-repository";
import { ICourtApproval } from "@/schemas/court-approval-schema/court-approval-schema";
import mongoose from "mongoose";

function buildFilter(id: string) {
  const conditions: any[] = [{ id }, { reservationNo: id }, { requestNo: id }];
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    conditions.push({ _id: new mongoose.Types.ObjectId(id) });
  }
  return { $or: conditions };
}

export class UpdateCourtApprovalService {
  public async execute(input: any): Promise<Result<ICourtApproval, Failure>> {
    try {
      const id = input.id || input._id;
      if (!id) {
        return Result.fail(Failure.badRequest("Missing court approval request ID"));
      }

      const existing = await courtApprovalRepository.findOne(buildFilter(id));
      if (!existing) {
        return Result.fail(Failure.notFound());
      }

      const rawData: any = { ...input };
      delete rawData.id;
      delete rawData._id;

      const newStatus = input.status || input.slotStatus || existing.status;

      const setData: any = {
        ...rawData,
        status: newStatus,
        slotStatus: newStatus,
      };

      if (input.rejectionReason) {
        setData.rejectionReason = input.rejectionReason;
      }

      const historyEntry = {
        action: newStatus,
        approverId: input.approverId || "Facility Staff",
        timestamp: new Date().toISOString(),
        remarks: input.rejectionReason
          ? `Rejected: ${input.rejectionReason}`
          : input.remarks || `Status updated to ${newStatus}`,
      };

      const updateOp: any = {
        $set: setData,
        $push: { approvalHistory: historyEntry },
      };

      const updated = await courtApprovalRepository.update(buildFilter(id), updateOp);
      if (!updated) {
        return Result.fail(Failure.badRequest("Failed to update court approval request"));
      }

      return Result.ok(updated);
    } catch (error) {
      console.error("Error updating court approval request:", error);
      return Result.fail(Failure.badRequest("Failed to update court approval request"));
    }
  }
}

export const updateCourtApprovalService = new UpdateCourtApprovalService();
