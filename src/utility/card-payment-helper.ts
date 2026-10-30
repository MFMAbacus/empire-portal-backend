import CardProcessingMaster from "@/schemas/card-processing-master-schema/card-processing-master-schema";
import { DateTime } from "@/utility/date-time";
import { RequestRecord } from "@/records/request-record";

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

  /**
   * Card requests ko RequestRecord[] format mein convert karta hai
   * taake B1Api.createInvoice directly use ho sake.
   */
  public static async buildRequestRecordsForB1(
    cardIds: string[]
  ): Promise<RequestRecord[]> {
    if (!cardIds || cardIds.length === 0) return [];
    try {
      const records = await CardProcessingMaster.find({
        $or: [{ requestId: { $in: cardIds } }, { id: { $in: cardIds } }],
        isArchived: false,
      }).lean();

      return records.map((r: any) => ({
        id: r.requestId || r.id,
        type: "general" as const,
        categoryId: "Card Replacement",
        categoryName: "Card Replacement",
        project: r.projectCode || null,
        subCategoryName: null,
        title: "Card Replacement",
        description: "",
        customerId: r.residentId || "",
        customerName: r.residentName || "",
        customerCode: "",
        staffId: null,
        staffName: null,
        salesPersonId: null,
        unitId: r.apartmentId || "",
        unitName: r.apartmentNo || "",
        status: "",
        priority: "low" as const,
        visitDate: "",
        visitTime: "none" as const,
        totalPrice: r.totalFee || 0,
        totalPayments: 0,
        isApproved: false,
        approvedAt: null,
        approveRemarks: null,
        isRefused: false,
        refusedAt: null,
        refuseRemarks: null,
        completedAt: null,
        completeRemarks: null,
        completeAttachments: [],
        items: [
          {
            itemId: "CARD-REPLACEMENT",
            name: `Card Replacement - ${r.reason || ""}`.trim(),
            quantity: 1,
            price: r.totalFee || 0,
            totalPrice: r.totalFee || 0,
          },
        ],
        attachments: [],
        updates: [],
        payments: [],
        rate: null,
        isIntangible: true,
        pin: null,
        vehicle: [],
        startTime: "",
        duration: "",
        comments: "",
        buyAttachments: [],
        creationDate: "",
        isArchived: false,
      }));
    } catch (e) {
      console.error("Error building request records for B1:", e);
      return [];
    }
  }
}
