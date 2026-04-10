import axios from "axios";

import {
  b1Password,
  b1UrlDocNumByDocEntry,
  b1UrlInvoice,
  b1UrlPostInvoice,
  b1User,
} from "@/config/app";

import { DateTime } from "@/utility/date-time";

import { PaymentRecord } from "@/records/payment-record";
import { RequestRecord } from "@/records/request-record";

export class B1Api {
  public static async createInvoice({
    requestsRecords,
    paymentRecord,
    salespersonId,
  }: {
    requestsRecords: RequestRecord[];
    paymentRecord: PaymentRecord;
    salespersonId?: string | null;
  }): Promise<B1ApiResponse> {
    let unitId = "";
    const invoicesLines: { [id: string]: InvoiceLine } = {};
    let lineRow = 0;
    for (const requestRecord of requestsRecords) {
      unitId = requestRecord.unitId;
      for (const requestItemRecord of requestRecord.items) {
        const lineId = requestRecord.id + requestItemRecord.itemId;
        const current = invoicesLines[lineId];
        if (typeof current === "undefined") {
          invoicesLines[lineId] = {
            id: requestItemRecord.itemId,
            requestId: requestRecord.id,
            row: lineRow++,
            name: requestItemRecord.name,
            price: requestItemRecord.totalPrice,
            quantity: requestItemRecord.quantity,
            staffId: requestRecord.staffId,
            salesPersonId: requestRecord.salesPersonId,
          };
        } else {
          current.price += requestItemRecord.totalPrice;
          current.quantity += requestItemRecord.quantity;
        }
      }
    }

    const date = DateTime.now();
    const requestData = {
      AmountPaid: calculateNetAmount(
        paymentRecord.totalAmount,
        paymentRecord.commissionAmount ?? "0",
      ),
      CommissionAmount: paymentRecord.commissionAmount ?? "0",
      Series: "189",
      BranchID: "3",
      Property: unitId,
      CardCode: paymentRecord.customerCode,
      ChequeDueDate: "",
      DiscountPercent: 0,
      DocDate: date.toDateString(),
      DueDate: date.toDateString(),
      Guid: date.toString().replaceAll(/[-:]/g, "."),
      SlpID: salespersonId || "",
      Lines: Object.values(invoicesLines).map((line) => {
        return {
          DiscountPercent: 0,
          ItemCode: line.id,
          ItemName: line.name,
          Price: line.price,
          Quantity: line.quantity,
          RowNo: line.row,
          VATCode: "X0",
          VatGroup: "X0",
          WhsCode: "E2-10",
          CostCenter: "D-015",
          name: line.name,
          RequestId: line.requestId,
          SlpID: line.salesPersonId,
        };
      }),
      PaymentType: paymentRecord.method,
      Reference: "cbff",
      VoucherNum: "",
      Remarks: paymentRecord.remarks || "",
      StaffId: paymentRecord.staffId,
    };

    const response = await axios.request({
      url: b1UrlInvoice,
      method: "POST",
      data: requestData,
      headers: {
        Authorization: `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const b1ApiResponse = response.data as B1ApiResponse;
    if (b1ApiResponse.Message !== "Success") {
      throw b1ApiResponse;
    }

    return b1ApiResponse;
  }

  public static async payInvoices({
    invoices,
    method,
    commissionAmount,
  }: {
    invoices: {
      type: string;
      sapInvoiceId: string;
      amount: number;
      date: string;
      cardCode: string;
    }[];
    method: "fib" | "credit-card" | "fast-pay";
    commissionAmount: string;
  }): Promise<B1ApiResponse> {
    const invoicesData = {
      invoices: invoices.map((invoice) => {
        return {
          Type: invoice.type,
          InvoiceDocEntry: invoice.sapInvoiceId,
          AmountPaid: calculateNetAmount(
            invoice.amount,
            commissionAmount ?? "0",
          ),
          CommissionAmount: commissionAmount ?? "0",
          CardCode: invoice.cardCode,
          DocDate: invoice.date,
          DueDate: invoice.date,
          PaymentType: method,
          Reference: "cbff",
          VoucherNum: "",
          Date: DateTime.now().toDateString(),
        };
      }),
    };
    const response = await axios.request({
      url: b1UrlPostInvoice,
      method: "POST",
      data: invoicesData,
      headers: {
        Authorization: `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const b1ApiResponse = response.data as B1ApiResponse;
    if (b1ApiResponse.Message !== "Success") {
      throw b1ApiResponse;
    }

    return b1ApiResponse;
  }

  public static async getDocNumByDocEntry(
    docEntry: string,
    isInvoicePayment?: boolean,
  ): Promise<string> {
    const url = `${b1UrlDocNumByDocEntry}/GetDocNum?Type=OINV&DocEntry=${docEntry}`;

    const response = await axios.request({
      url,
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const b1ApiResponse = (response.data as B1ApiDocNumResponse[]) ?? docEntry;

    return b1ApiResponse[0].DocNum ?? docEntry;
  }
}

export type B1ApiDocNumResponse = {
  DocNum: string;
};

export type B1ApiResponse = {
  Message: string;
  DocEntry: string;
  Description: string;
  PaymentStatus: string;
  PaymentEntry: string;
};

type InvoiceLine = {
  id: string;
  requestId: string;
  row: number;
  name: string;
  price: number;
  quantity: number;
  staffId: string | null;
  salesPersonId: string | null;
};

/**
 * Calculates net amount after deducting commission
 * @param totalAmount number
 * @param commissionAmount string (decimal value e.g. "50.53")
 * @returns number (rounded to 2 decimal places)
 */
export function calculateNetAmount(
  totalAmount: number,
  commissionAmount: string,
): number {
  if (typeof totalAmount !== "number" || isNaN(totalAmount)) {
    throw new Error("Invalid totalAmount");
  }

  const commission = parseFloat(commissionAmount);

  if (isNaN(commission)) {
    throw new Error("Invalid commissionAmount");
  }

  const result = totalAmount - commission;

  return Number(result.toFixed(2));
}
