import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { courtApprovalRepository } from "@/repositories/court-approval-repository";
import { ICourtApproval } from "@/schemas/court-approval-schema/court-approval-schema";
import mongoose from "mongoose";

export class GetSingleCourtApprovalService {
  public async execute(id: string): Promise<Result<ICourtApproval, Failure>> {
    try {
      const conditions: any[] = [{ id }, { reservationNo: id }, { requestNo: id }];
      if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
        conditions.push({ _id: new mongoose.Types.ObjectId(id) });
      }

      const record = await courtApprovalRepository.findOne({ $or: conditions });
      if (!record) {
        return Result.fail(Failure.notFound());
      }
      return Result.ok(record);
    } catch (error) {
      console.error("Error fetching single court approval:", error);
      return Result.fail(Failure.badRequest("Failed to fetch court approval request"));
    }
  }
}

export const getSingleCourtApprovalService = new GetSingleCourtApprovalService();
