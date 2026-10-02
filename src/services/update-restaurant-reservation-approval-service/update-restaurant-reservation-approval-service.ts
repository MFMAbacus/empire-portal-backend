import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { RestaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";

type Props = {
  restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;
};

export class UpdateRestaurantReservationApprovalService {
  protected _restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;

  public constructor(props: Props) {
    this._restaurantReservationApprovalRepository = props.restaurantReservationApprovalRepository;
  }

  public async execute(input: any): Promise<Result<any, Failure>> {
    try {
      const payload: any = { ...input };

      // Resolve status dynamically using CommonStatusMaster sequence if sequence is passed
      if (!payload.status && payload.sequence !== undefined) {
        const statusDoc = await CommonStatusMaster.findOne({
          $or: [
            { module: "Restaurant Reservation Approval" },
            { module: "Restaurant Reservation" },
            { module: "Restaurant Reservation Approval Master" },
          ],
          sequence: payload.sequence,
          isArchived: false,
        }).lean();
        if (statusDoc) {
          payload.status = (statusDoc as any).statusName;
        }
      }

      if (payload.status === "Arrived") {
        payload.arrivalConfirmedAt = new Date();
      }

      const existing = await this._restaurantReservationApprovalRepository.get(payload.id || payload._id);
      if (!existing) {
        return Result.fail(Failure.notFound());
      }

      const historyEntry = {
        action: payload.status || existing.status,
        approverId: payload.approverId ?? null,
        timestamp: new Date().toISOString(),
        remarks: payload.rejectionReason || payload.remarks || null,
      };

      const updatedHistory = [...(existing.approvalHistory || []), historyEntry];
      payload.approvalHistory = updatedHistory;

      const result = await this._restaurantReservationApprovalRepository.Update(payload);
      if (!result) {
        return Result.fail(Failure.badRequest("Failed to update restaurant reservation approval request"));
      }
      return Result.ok(result);
    } catch (error) {
      console.error("Error updating restaurant reservation approval request:", error);
      return Result.fail(Failure.badRequest("Failed to update restaurant reservation approval request"));
    }
  }
}

export const makeUpdateRestaurantReservationApprovalService = (props: Props) =>
  new UpdateRestaurantReservationApprovalService(props);
