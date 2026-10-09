import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { ICardProcessingMaster } from "@/schemas/card-processing-master-schema";
 
import CardProcessingMaster from "@/schemas/card-processing-master-schema/card-processing-master-schema";
import AccessCardMaster from "@/schemas/access-card-master-schema/access-card-master-schema";
import CardReplacementReasonMaster from "@/schemas/card-replacement-reason-master-schema/card-replacement-reason-master-schema";
import ReplacementFeeMaster from "@/schemas/replacement-fee-master-schema/replacement-fee-master-schema";
import DeliverySLAMaster from "@/schemas/delivery-sla-master-schema/delivery-sla-master-schema";
import AccessCardStaffMaster from "@/schemas/access-card-staff-master-schema/access-card-staff-master-schema";
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema/apartment-master-schema";

type Props = {
  cardProcessingMasterRepository: CardProcessingMasterRepository;
};

async function generateSequentialRequestNo(): Promise<string> {
  const records = await CardProcessingMaster.find({ requestNo: /^ACR-\d+$/ })
    .select("requestNo")
    .lean();

  let maxSeq = 0;
  for (const r of records) {
    if (r.requestNo) {
      const match = r.requestNo.match(/^ACR-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const formatted = String(nextSeq).padStart(6, "0");
  return `ACR-${formatted}`;
}

export class CreateCardProcessingMasterService {
  protected _cardProcessingMasterRepository: CardProcessingMasterRepository;

  public constructor(props: Props) {
    this._cardProcessingMasterRepository = props.cardProcessingMasterRepository;
  }

  public async execute(input: any): Promise<Result<ICardProcessingMaster, Failure>> {
    try {
      const payload: any = { ...input };

      // Generate sequential request number (ACR-000001)
      const seqNo = await generateSequentialRequestNo();
      payload.id = seqNo;
      payload.requestNo = seqNo;

      // Extract basic inputs
      const residentId = payload.residentId;
      const cardId = payload.cardId;
      const reasonId = payload.reasonId || payload.reason;
      let projectCode = payload.projectCode;

      // Lookup Resident & Apartment details if available
      if (residentId && !payload.residentName) {
        const residentDoc = await ResidentMaster.findOne({
          $or: [{ id: residentId }, { residentId }],
        }).lean();
        if (residentDoc) {
          payload.residentName = (residentDoc as any).fullName || (residentDoc as any).name || residentId;
          if (!projectCode) projectCode = (residentDoc as any).projectCode;
          if (!payload.apartmentId) payload.apartmentId = (residentDoc as any).apartmentId;
        } else {
          payload.residentName = residentId;
        }
      }

      if (payload.apartmentId && !payload.apartmentNo) {
        const aptDoc = await ApartmentMaster.findOne({
          $or: [{ id: payload.apartmentId }, { apartmentId: payload.apartmentId }],
        }).lean();
        if (aptDoc) {
          payload.apartmentNo = (aptDoc as any).apartmentNo || (aptDoc as any).unitNo || payload.apartmentId;
          if (!projectCode) projectCode = (aptDoc as any).projectCode;
        } else {
          payload.apartmentNo = payload.apartmentId;
        }
      }

      // Lookup Access Card details from AccessCardMaster
      if (cardId) {
        const cardDoc = await AccessCardMaster.findOne({
          $or: [{ id: cardId }, { cardId }, { serialNo: cardId }],
        }).lean();

        if (cardDoc) {
          payload.fullSerialNo = (cardDoc as any).serialNo || cardId;
          payload.maskedSerialNo = (cardDoc as any).maskedSerial || `****-****-${payload.fullSerialNo.slice(-4)}`;
          if (!projectCode) projectCode = (cardDoc as any).projectCode;
          if (!payload.residentId) payload.residentId = (cardDoc as any).residentId;
          if (!payload.apartmentId) payload.apartmentId = (cardDoc as any).apartmentId;

          // Portal suspension: set cardStatus to Suspended in AccessCardMaster
          await AccessCardMaster.updateOne(
            { _id: (cardDoc as any)._id },
            { $set: { cardStatus: "Suspended" } }
          );
        } else {
          payload.fullSerialNo = cardId;
          payload.maskedSerialNo = `****-****-${cardId.slice(-4)}`;
        }
      }

      payload.projectCode = projectCode || "PRJ-001";

      // Lookup Replacement Reason from CardReplacementReasonMaster
      if (reasonId) {
        const reasonDoc = await CardReplacementReasonMaster.findOne({
          $or: [{ id: reasonId }, { reasonId }, { reasonName: reasonId }],
        }).lean();

        if (reasonDoc) {
          payload.reason = (reasonDoc as any).reasonName || reasonId;
        } else {
          payload.reason = reasonId;
        }
      } else {
        payload.reason = "Lost Card";
      }

      // Lookup Replacement Fee Master for feeAmount & tax
      const feeDoc = await ReplacementFeeMaster.findOne({
        projectCode: payload.projectCode,
        isActive: true,
        isArchived: false,
      }).lean();

      if (feeDoc) {
        payload.feeAmount = (feeDoc as any).feeAmount ?? 25;
        payload.currency = (feeDoc as any).currency || "USD";
        payload.taxAmount = (feeDoc as any).tax || "5%";
      } else {
        payload.feeAmount = payload.feeAmount ?? 25;
        payload.currency = payload.currency || "USD";
        payload.taxAmount = payload.taxAmount || "5%";
      }

      // Calculate total fee
      const numericTax = parseFloat(payload.taxAmount.replace("%", "")) || 0;
      payload.totalFee = payload.feeAmount + (payload.feeAmount * numericTax) / 100;

      // Lookup Delivery SLA Configuration
      const slaDoc = await DeliverySLAMaster.findOne({
        projectCode: payload.projectCode,
        isActive: true,
        isArchived: false,
      }).lean();

      if (slaDoc) {
        payload.deliverySLAHours = (slaDoc as any).deliveryPeriodHours || "24";
      } else {
        payload.deliverySLAHours = "24";
      }

      // Lookup Access Card Staff Mapping for routing
      const staffDoc = await AccessCardStaffMaster.findOne({
        projectCode: payload.projectCode,
        isActive: true,
        isArchived: false,
      }).lean();

      if (staffDoc) {
        payload.assignedStaffRole = (staffDoc as any).staffRole || "Access Card Specialist";
      }

      // Default fields
      payload.paymentMethod = payload.paymentMethod || "Credit Card";
      payload.paymentStatus = payload.paymentStatus || "Paid";
      payload.isSuspended = true; // Portal suspension default for lost card replacement
      payload.replacementStatus = "Pending";
      payload.status = "Pending";
      payload.active = true;
      payload.isArchived = false;
      payload.approvalHistory = [
        {
          action: "Submitted",
          approverId: null,
          timestamp: new Date().toISOString(),
          remarks: `Card replacement requested for ${payload.reason}. Portal card suspension active.`,
        },
      ];

      await this._cardProcessingMasterRepository.Create(payload as ICardProcessingMaster);
      return Result.ok(payload as ICardProcessingMaster);
    } catch (error) {
      console.error("Error creating card processing request:", error);
      return Result.fail(Failure.badRequest("Failed to create card replacement request"));
    }
  }
}
