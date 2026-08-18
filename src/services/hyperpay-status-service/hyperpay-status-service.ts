import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";
import { HyperPayApi } from "@/utility/hyperpay-api";
import { DateTime } from "@/utility/date-time";
import { PaymentRepository } from "@/repositories/payment-repository";
import { RequestRepository } from "@/repositories/request-repository";
import { UserRepository } from "@/repositories/user-repository";
import { InvoicePaymentRepository } from "@/repositories/invoice-payment-repository";
import { B1Api, B1ApiResponse } from "@/utility/b1-api";
import { transactionService } from "../transaction-service";
import { Generator } from "@/utility/generator";
import NotificationFCM from "@/utility/notification/notification";
import { getTokensByUserId } from "@/data/clients-sessions";

type Input = {
  checkoutId?: string;
  resourcePath?: string;
};

type Props = {
  requestRepository: RequestRepository;
  paymentRepository: PaymentRepository;
  invoicePaymentRepository: InvoicePaymentRepository;
  userRepository: UserRepository;
};

export class HyperPayStatusService {
  protected _requestRepository: RequestRepository;
  protected _paymentRepository: PaymentRepository;
  protected _invoicePaymentRepository: InvoicePaymentRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._paymentRepository = props.paymentRepository;
    this._invoicePaymentRepository = props.invoicePaymentRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<any, Failure>> {
    const validationBag = ValidationBag.make();

    if (!input.checkoutId && !input.resourcePath) {
      validationBag.set(
        "payment_reference",
        Validation.make(null).mandatory().getRule(),
      );
      return Result.fail(Failure.validation(validationBag));
    }

    const statusResult = await HyperPayApi.checkPaymentStatus({
      checkoutId: input.checkoutId,
      resourcePath: input.resourcePath,
    });

    if (statusResult.hasFailed()) {
      return Result.ok({
        message: "Error checking payment status",
        error: statusResult.getFailure(),
      });
    }

    const paymentData = statusResult.getValue();
    const resultCode = paymentData.result.code;
    const paymentStatus = HyperPayApi.getPaymentStatus(resultCode);

    if (paymentStatus === "PENDING") {
      return Result.ok({ message: "Payment Pending" });
    }

    // Determine payment type based on merchantTransactionId prefix
    const merchantTxnId = paymentData.merchantTransactionId;
    if (!merchantTxnId) {
      return Result.fail(Failure.badRequest("Missing merchant transaction ID"));
    }

    const isRequestPayment = merchantTxnId.startsWith("R");
    const isInvoicePayment = merchantTxnId.startsWith("I");

    if (!isRequestPayment && !isInvoicePayment) {
      return Result.fail(Failure.badRequest("Invalid payment type"));
    }

    if (isRequestPayment) {
      return await this.handleRequestPayment(input, paymentData, paymentStatus);
    } else {
      return await this.handleInvoicePayment(input, paymentData, paymentStatus);
    }
  }

  private async handleRequestPayment(
    input: Input,
    paymentData: any,
    paymentStatus: string,
  ): Promise<Result<any, Failure>> {
    // Find payment record by checkout ID or merchant transaction ID
    let paymentRecord;
    if (input.checkoutId) {
      paymentRecord = await this._paymentRepository.get(input.checkoutId);
    } else if (paymentData.merchantTransactionId) {
      paymentRecord = await this._paymentRepository.getByUuid(
        paymentData.merchantTransactionId,
      );
    }

    if (typeof paymentRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    if (paymentRecord.isConfirmed) {
      return Result.ok({ message: "Payment already confirmed" });
    }

    if (paymentStatus === "PAID") {
      const requestsRecords = await this._requestRepository.getAll({
        ids: paymentRecord.requestsIds,
      });

      let salespersonId: string | null = null;
      if (paymentRecord.staffId !== null) {
        const staffRecord = await this._userRepository.get(
          paymentRecord.staffId,
        );
        if (staffRecord) {
          salespersonId = staffRecord.salespersonId;
        }
      }

      let b1ResponseData;
      try {
        b1ResponseData = await B1Api.createInvoice({
          requestsRecords,
          paymentRecord,
          salespersonId,
        });
      } catch (error: any) {
        paymentRecord.sapMessage =
          error?.Description ?? "Error During B1 Create Invoice";
        paymentRecord.sapStatus = false;
        paymentRecord.retryDate = DateTime.now().toString();
        paymentRecord.isFailed = false;

        await this._paymentRepository.Update(paymentRecord);
        await transactionService.logB1CreateInvoiceFailed(
          paymentRecord,
          paymentRecord.sapMessage ?? "",
        );
        return Result.fail(
          Failure.make({
            code: "b1-error",
            data: error,
          }),
        );
      }

      const invocieDocNum = await B1Api.getDocNumByDocEntry(
        b1ResponseData?.DocEntry ?? "",
      );

      paymentRecord.callBackAttempted = true;
      paymentRecord.isFailed = false;
      paymentRecord.isConfirmed = true;
      paymentRecord.confirmedAt = DateTime.now().toString();
      paymentRecord.sapMessage = b1ResponseData?.DocEntry ?? "";
      paymentRecord.docNum = invocieDocNum;
      paymentRecord.sapStatus = true;
      paymentRecord.retryDate = DateTime.now().toString();

      if (paymentRecord.customerId) {
        const customerTokens = getTokensByUserId(paymentRecord.customerId);

        customerTokens.length > 0 &&
          (await NotificationFCM.getInstance().sendToMany(
            {
              messageId: Generator.id(),
              title: "Payment Successful",
              body: `Dear user,
     Your payment has been received. In case of any problem, kindly contact head office.`,
              id: b1ResponseData.DocEntry,
              type: "payment",
            },
            customerTokens,
          ));
      }

      await this._paymentRepository.Update(paymentRecord);
      await this._requestRepository.pay(paymentRecord);

      await transactionService.logPaymentConfirmed(
        paymentRecord,
        b1ResponseData?.DocEntry,
      );
      return Result.ok({ message: "Payment successfully processed" });
    } else if (paymentStatus === "DECLINED") {
      paymentRecord.isFailed = true;
      paymentRecord.callBackAttempted = true;
      paymentRecord.retryDate = DateTime.now().toString();
      await this._paymentRepository.Update(paymentRecord);

      await transactionService.logPaymentFailed(
        paymentRecord,
        `HyperPay payment declined: ${paymentData.result.description}`,
      );

      return Result.ok({ message: "Payment Declined" });
    } else {
      return Result.ok({ message: "Payment Pending" });
    }
  }

  private async handleInvoicePayment(
    input: Input,
    paymentData: any,
    paymentStatus: string,
  ): Promise<Result<any, Failure>> {
    // Find invoice payment record by checkout ID or merchant transaction ID
    let invoicePaymentRecord;
    if (input.checkoutId) {
      invoicePaymentRecord = await this._invoicePaymentRepository.get(
        input.checkoutId,
      );
    } else if (paymentData.merchantTransactionId) {
      invoicePaymentRecord = await this._invoicePaymentRepository.getByUuid(
        paymentData.merchantTransactionId,
      );
    }

    if (typeof invoicePaymentRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    if (invoicePaymentRecord.isConfirmed) {
      return Result.ok({ message: "Payment already confirmed" });
    }

    if (paymentStatus !== "PAID") {
      invoicePaymentRecord.callBackAttempted = true;
      invoicePaymentRecord.isFailed = true;
      await this._invoicePaymentRepository.Update(invoicePaymentRecord);
      return Result.fail(Failure.paymentFailed());
    }

    let b1Response: B1ApiResponse;
    try {
      b1Response = await B1Api.payInvoices({
        invoices: invoicePaymentRecord.items,
        method: invoicePaymentRecord.method,
        commissionAmount: invoicePaymentRecord.commissionAmount,
      });
    } catch (error: any) {
      invoicePaymentRecord.sapMessage =
        error?.Description ?? "Error During B1 Create Invoice";
      invoicePaymentRecord.sapStatus = false;
      invoicePaymentRecord.retryDate = DateTime.now().toString();

      invoicePaymentRecord.callBackAttempted = false;
      invoicePaymentRecord.isFailed = false;
      invoicePaymentRecord.isConfirmed = false;
      invoicePaymentRecord.confirmedAt = DateTime.now().toString();
      await this._invoicePaymentRepository.Update(invoicePaymentRecord);

      console.error(error);
      return Result.fail(
        Failure.make({
          code: "b1-error",
          data: error,
        }),
      );
    }
    const invoiceDocNum = await B1Api.getDocNumByDocEntry(
      b1Response?.DocEntry ?? "",
      true,
    );

    invoicePaymentRecord.callBackAttempted = true;
    invoicePaymentRecord.isFailed = false;

    invoicePaymentRecord.sapMessage = b1Response.DocEntry;
    invoicePaymentRecord.docNum = invoiceDocNum;
    invoicePaymentRecord.sapStatus = true;
    invoicePaymentRecord.retryDate = DateTime.now().toString();

    invoicePaymentRecord.isConfirmed = true;
    invoicePaymentRecord.confirmedAt = DateTime.now().toString();

    await this._invoicePaymentRepository.Update(invoicePaymentRecord);

    await transactionService.logInvoicePaymentConfirmed(
      invoicePaymentRecord,
      b1Response.DocEntry,
    );

    if (invoicePaymentRecord.customerId) {
      const customerTokens = getTokensByUserId(invoicePaymentRecord.customerId);

      customerTokens.length > 0 &&
        (await NotificationFCM.getInstance().sendToMany(
          {
            messageId: Generator.id(),
            title: "Payment Successful",
            body: `Dear user,
Your payment has been received. In case of any problem, kindly contact head office.`,
            id: b1Response.PaymentEntry,
            type: "invoice_payment",
          },
          customerTokens,
        ));
    }

    return Result.ok({ message: "Invoice payment successfully processed" });
  }
}
