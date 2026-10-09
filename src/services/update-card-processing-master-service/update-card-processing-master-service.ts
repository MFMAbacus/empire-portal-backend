import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { ICardProcessingMaster } from "@/schemas/card-processing-master-schema";
import AccessCardMaster from "@/schemas/access-card-master-schema/access-card-master-schema";

type Props = {
  cardProcessingMasterRepository: CardProcessingMasterRepository;
};

export class UpdateCardProcessingMasterService {
  protected _cardProcessingMasterRepository: CardProcessingMasterRepository;

  public constructor(props: Props) {
    this._cardProcessingMasterRepository = props.cardProcessingMasterRepository;
  }

  public async execute(input: any): Promise<Result<ICardProcessingMaster, Failure>> {
    try {
      const { id, ...updates } = input;
      const targetId = id || updates._id || updates.requestNo;

      if (!targetId) {
        return Result.fail(Failure.badRequest("Request ID or requestNo is required"));
      }

      const existing = await this._cardProcessingMasterRepository.get(targetId);
      if (!existing) {
        return Result.fail(Failure.notFound());
      }

      const payload: Partial<ICardProcessingMaster> = {
        id: existing.id,
        ...updates,
      };

      // Handle replacementStatus update
      if (updates.replacementStatus && updates.replacementStatus !== existing.replacementStatus) {
        payload.replacementStatus = updates.replacementStatus;
        payload.status = updates.replacementStatus;

        // If status becomes Delivered, mark old card as Replaced in AccessCardMaster
        if (updates.replacementStatus === "Delivered" && existing.cardId) {
          await AccessCardMaster.updateOne(
            { $or: [{ id: existing.cardId }, { cardId: existing.cardId }] },
            { $set: { cardStatus: "Replaced" } }
          );
        }
      }

      // Handle Portal card suspension update
      if (updates.isSuspended !== undefined && updates.isSuspended !== existing.isSuspended) {
        payload.isSuspended = updates.isSuspended;
        if (existing.cardId) {
          await AccessCardMaster.updateOne(
            { $or: [{ id: existing.cardId }, { cardId: existing.cardId }] },
            { $set: { cardStatus: updates.isSuspended ? "Suspended" : "Active" } }
          );
        }
      }

      // Build history entry if status or suspension changed
      const historyEntry = {
        action: updates.replacementStatus || (updates.isSuspended ? "Suspended" : "Unsuspended") || "Updated",
        approverId: updates.approverId || null,
        timestamp: new Date().toISOString(),
        remarks: updates.rejectionReason || updates.remarks || `Status updated to ${updates.replacementStatus || "modified"}`,
      };

      const existingHistory = existing.approvalHistory || [];
      payload.approvalHistory = [...existingHistory, historyEntry];

      const updatedDoc = await this._cardProcessingMasterRepository.Update(payload);

      if (!updatedDoc) {
        return Result.fail(Failure.badRequest("Failed to update card processing request"));
      }

      return Result.ok(updatedDoc);
    } catch (error) {
      console.error("Error updating card processing request:", error);
      return Result.fail(Failure.badRequest("Failed to update card processing request"));
    }
  }
}
