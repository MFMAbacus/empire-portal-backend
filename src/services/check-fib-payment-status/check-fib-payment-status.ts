import { Payment } from "@/schemas/payment-schema";
import { RequestRepositoryDb } from "@/repositories/request-repository";
import { PaymentRepositoryDb } from "@/repositories/payment-repository";
import { UserRepositoryDb } from "@/repositories/user-repository";
import { B1Api } from "@/utility/b1-api";
import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { DateTime } from "@/utility/date-time";
import { FibApi } from "@/utility/fib-api";
import { InvoicePaymentRepositoryDb } from "@/repositories/invoice-payment-repository";
import { InvoicePayment } from "@/schemas/invoice-payment-schema";
import { FastPayApi } from "@/utility/fastPay-api";
import { transactionService } from "../transaction-service";

type Props = {
  requestRepository: RequestRepositoryDb;
  userRepository: UserRepositoryDb;
  paymentRepository: PaymentRepositoryDb;
  invoicePaymentRepository: InvoicePaymentRepositoryDb;
};

export type PaymentStatusResponse = {
  paymentId: string;
  status: "PAID" | "UNPAID" | "DECLINED";
  validUntil: string;
  paidAt: string | null;
  amount: {
    amount: number;
    currency: string;
  };
  decliningReason:
    | "SERVER_FAILURE"
    | "PAYMENT_EXPIRATION"
    | "PAYMENT_CANCELLATION"
    | null;
  declinedAt: string | null;
  paidBy: {
    name: string | null;
    iban: string | null;
  } | null;
};

export class CheckFibPaymentStatus {
  protected _requestRepository: RequestRepositoryDb;
  protected _userRepository: UserRepositoryDb;
  protected _paymentRepository: PaymentRepositoryDb;
  protected _invoicePaymentRepository: InvoicePaymentRepositoryDb;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._userRepository = props.userRepository;
    this._paymentRepository = props.paymentRepository;
    this._invoicePaymentRepository = props.invoicePaymentRepository;
  }

  public async execute(): Promise<void> {
    const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
    const threeMinutesBefore = new Date(new Date().getTime() - 3 * 60 * 1000);

    const payments = await Payment.find({
      isConfirmed: false,
      sapStatus: false,
      callBackAttempted: false,
      isFailed: false,
      method: { $in: ["fib", "fast-pay"] },
      createdAt: { $lt: threeMinutesBefore },
    }).populate("items");

    const invoicePayments = await InvoicePayment.find({
      isConfirmed: false,
      sapStatus: false,
      callBackAttempted: false,
      isFailed: false,
      method: { $in: ["fib", "fast-pay"] },
      createdAt: { $lt: threeMinutesBefore },
    }).populate("items");

    if (payments && payments.length >= 0) {
      for (const paymentRecord of payments) {
        console.log("payment id is ", paymentRecord.id);
        let paymentStatusResult;

        const createdAt = new Date(paymentRecord.createdAt);

        if (createdAt < oneHourAgo) {
          paymentRecord.isFailed = true;
          paymentRecord.callBackAttempted = true;
          paymentRecord.retryDate = DateTime.now().toString();
          await this._paymentRepository.Update(paymentRecord);

          await transactionService.logPaymentFailed(
            paymentRecord,
            "Payment expired after 1 hour"
          );

          console.log(
            `Payment ${paymentRecord.id} marked as FAILED after 1 hour`
          );
          continue;
        }

        if (paymentRecord.method === "fib") {
          const payemntStatusResponseData = await FibApi.checkStatus(
            paymentRecord.id
          );

          if (payemntStatusResponseData.hasFailed()) {
            console.log(
              "payement status has been failed =>",
              payemntStatusResponseData.getFailure()
            );

            continue;
          }

          paymentStatusResult = payemntStatusResponseData.getValue();

          if (!paymentStatusResult) {
            console.log(
              "payments status result is NUll ===>",
              paymentStatusResult
            );
            continue;
          }

          console.log("payemnt sttaus result===>", paymentStatusResult);

          if (paymentStatusResult.status !== "PAID") {
            continue;
          }
        }

        if (paymentRecord.method === "fast-pay") {
          const payemntStatusResponseData = await FastPayApi.CheckStatus(
            paymentRecord.id
          );
          if (payemntStatusResponseData.hasFailed()) {
            console.log(
              "payement status has been failed =>",
              payemntStatusResponseData.getFailure()
            );

            continue;
          }

          try {
            paymentStatusResult = payemntStatusResponseData.getValue().data;
            if (!paymentStatusResult) {
              continue;
            }
            console.log("payemnt sttaus result===>", paymentStatusResult);

            if (paymentStatusResult.status !== "Success") {
              continue;
            }
          } catch (error) {
            continue;
          }
        }

        const requestsRecords = await this._requestRepository.getAll({
          ids: paymentRecord.requestsIds,
        });

        let salespersonId: string | null = null;

        if (paymentRecord.staffId !== null) {
          const staffRecord = await this._userRepository.get(
            paymentRecord.staffId
          );
          if (typeof staffRecord === "undefined") {
            console.error("Invalid staff record");
            continue;
          }
          salespersonId = staffRecord.salespersonId;
        }
        let b1ResponseData;
        try {
          b1ResponseData = await B1Api.createInvoice({
            requestsRecords,
            paymentRecord,
            salespersonId,
          });
          console.log("b1 response is ", b1ResponseData);
        } catch (error: any) {
          console.error("Error during B1 API call", error);

          paymentRecord.sapMessage =
            error?.Description ??
            `Error During B1 Create Invoice ${DateTime.now().toString()}`;
          paymentRecord.sapStatus = false;
          paymentRecord.retryDate = DateTime.now().toString();
          paymentRecord.isFailed = false;

          await this._paymentRepository.Update(paymentRecord);

          await transactionService.logB1CreateInvoiceFailed(
            paymentRecord,
            paymentRecord.sapMessage ?? ""
          );

          Result.fail(
            Failure.make({
              code: "b1-error",
              data: error,
            })
          );
          continue;
        }

        const invocieDocNum = await B1Api.getDocNumByDocEntry(
          b1ResponseData?.DocEntry ?? ""
        );
        paymentRecord.callBackAttempted = true;
        paymentRecord.isFailed = false;
        paymentRecord.isConfirmed = true;
        paymentRecord.confirmedAt = DateTime.now().toString();
        paymentRecord.sapMessage = b1ResponseData?.DocEntry ?? "";
        paymentRecord.docNum = invocieDocNum;
        paymentRecord.sapStatus = true;
        paymentRecord.retryDate = DateTime.now().toString();

        await this._paymentRepository.Update(paymentRecord);
        await this._requestRepository.pay(paymentRecord);

        await transactionService.logPaymentConfirmed(
          paymentRecord,
          b1ResponseData?.DocEntry
        );
      }
    }

    if (invoicePayments && invoicePayments.length >= 0) {
      for (const invoicePaymentRecord of invoicePayments) {
        console.log("invoicePaymentRecord id is ", invoicePaymentRecord.id);

        let paymentStatusResult;

        const createdAt = new Date(invoicePaymentRecord.createdAt);

        if (createdAt < oneHourAgo) {
          invoicePaymentRecord.isFailed = true;
          invoicePaymentRecord.callBackAttempted = true;
          invoicePaymentRecord.retryDate = DateTime.now().toString();
          await this._invoicePaymentRepository.Update(invoicePaymentRecord);

          await transactionService.logInvoicePaymentFailed(
            invoicePaymentRecord,
            "Invoice payment expired after 1 hour"
          );

          console.log(
            `Payment ${invoicePaymentRecord.id} marked as FAILED after 1 hour`
          );
          continue;
        }

        if (invoicePaymentRecord.method === "fib") {
          const invoicepaymentStatusResult = await FibApi.checkStatus(
            invoicePaymentRecord.id
          );

          if (invoicepaymentStatusResult.hasFailed()) {
            console.log(
              "payement status has been failed =>",
              invoicepaymentStatusResult.getFailure()
            );

            continue;
          }

          paymentStatusResult = invoicepaymentStatusResult.getValue();

          if (!paymentStatusResult) continue;

          console.log("payemnt sttaus result===>", paymentStatusResult);

          const createdAt = new Date(invoicePaymentRecord.createdAt);

          if (paymentStatusResult.status !== "PAID" && createdAt < oneHourAgo) {
            continue;
          }
        }

        if (invoicePaymentRecord.method === "fast-pay") {
          const invoicepaymentStatusResult = await FastPayApi.CheckStatus(
            invoicePaymentRecord.id
          );

          if (invoicepaymentStatusResult.hasFailed()) {
            console.log(
              "payement status has been failed =>",
              invoicepaymentStatusResult.getFailure()
            );

            continue;
          }

          try {
            paymentStatusResult = invoicepaymentStatusResult.getValue().data;
            if (!paymentStatusResult) {
              continue;
            }
            console.log("payemnt sttaus result===>", paymentStatusResult);

            const createdAt = new Date(invoicePaymentRecord.createdAt);

            if (
              paymentStatusResult.status !== "Success" &&
              createdAt < oneHourAgo
            ) {
              continue;
            }
          } catch (error) {
            invoicePaymentRecord.isFailed = true;
            invoicePaymentRecord.callBackAttempted = true;
            invoicePaymentRecord.retryDate = DateTime.now().toString();
            await this._invoicePaymentRepository.Update(invoicePaymentRecord);
            continue;
          }
        }

        let b1Response;
        try {
          b1Response = await B1Api.payInvoices({
            invoices: invoicePaymentRecord.items,
            method: invoicePaymentRecord.method,
            commissionAmount: invoicePaymentRecord.commissionAmount,
          });
          console.log("b1 response is ", b1Response);
        } catch (error: any) {
          console.error("Error during B1 API call", error);

          invoicePaymentRecord.sapMessage =
            error?.Description ?? "Error During B1 Create Invoice";
          invoicePaymentRecord.sapStatus = false;
          invoicePaymentRecord.retryDate = DateTime.now().toString();

          await this._invoicePaymentRepository.Update(invoicePaymentRecord);

          Result.fail(
            Failure.make({
              code: "b1-error",
              data: error,
            })
          );
          continue;
        }

        const invoiceDocNum = await B1Api.getDocNumByDocEntry(
          b1Response?.DocEntry ?? "",
          true
        );

        invoicePaymentRecord.callBackAttempted = true;
        invoicePaymentRecord.isFailed = false;
        invoicePaymentRecord.isConfirmed = true;
        invoicePaymentRecord.confirmedAt = DateTime.now().toString();
        invoicePaymentRecord.sapMessage = b1Response?.DocEntry ?? "";
        invoicePaymentRecord.docNum = invoiceDocNum;
        invoicePaymentRecord.sapStatus = true;
        invoicePaymentRecord.retryDate = DateTime.now().toString();

        await this._invoicePaymentRepository.Update(invoicePaymentRecord);

        await transactionService.logInvoicePaymentConfirmed(
          invoicePaymentRecord,
          b1Response?.DocEntry
        );
      }
    }
  }
}
