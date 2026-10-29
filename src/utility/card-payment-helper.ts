import CardProcessingMaster from "@/schemas/card-processing-master-schema/card-processing-master-schema";
import { DateTime } from "@/utility/date-time";

export class CardPaymentHelper {
  public static isCardRequest(id: string): boolean {
    return typeof id === "string" && id.trim().startsWith("ACR-");
  }

  public static async getCardRequests(ids: string[]): Promise<any[]> {
    if (!ids || ids.length === 0) return [];
    try {
      const records = await CardProcessingMaster.find({
        $or: [{ requestId: { $in: ids } }, { id: { $in: ids } }],
        isArchived: false,
      }).lean();
      return records || [];
    } catch (e) {
      console.error("Error fetching card requests:", e);
      return [];
    }
  }

  public static async confirmCardRequestsPayment(
    cardIds: string[],
    paymentRecord: any
  ): Promise<void> {
    if (!cardIds || cardIds.length === 0) return;
    try {
      const methodName =
        paymentRecord.method === "credit-card"
          ? "Credit Card"
          : paymentRecord.method === "fast-pay"
          ? "FastPay"
          : paymentRecord.method;

      await CardProcessingMaster.updateMany(
        { $or: [{ requestId: { $in: cardIds } }, { id: { $in: cardIds } }] },
        {
          $set: {
            paymentStatus: "Paid",
            paymentMethod: methodName,
            replacementStatus: "In Process",
          },
          $push: {
            approvalHistory: {
              action: "Payment Received",
              approverId: null,
              timestamp: DateTime.now().toString(),
              remarks: `Payment received via ${methodName}. Payment Ref: ${
                paymentRecord.docNum || paymentRecord.id
              }`,
            },
          },
        }
      );
    } catch (e) {
      console.error("Error confirming card requests payment:", e);
    }
  }

  public static async markCardRequestsFailed(
    cardIds: string[],
    reason?: string
  ): Promise<void> {
    if (!cardIds || cardIds.length === 0) return;
    try {
      await CardProcessingMaster.updateMany(
        { $or: [{ requestId: { $in: cardIds } }, { id: { $in: cardIds } }] },
        {
          $set: {
            paymentStatus: "Failed",
          },
          $push: {
            approvalHistory: {
              action: "Payment Failed",
              approverId: null,
              timestamp: DateTime.now().toString(),
              remarks: `Payment failed. Reason: ${reason || "Declined / Cancelled"}`,
            },
          },
        }
      );
    } catch (e) {
      console.error("Error marking card requests failed:", e);
    }
  }
}
