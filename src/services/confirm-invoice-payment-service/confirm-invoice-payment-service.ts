import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { FibApi } from "@/utility/fib-api";
import { ValidationBag } from "@/utility/validation-bag";
import { optional } from "@/utility/optional";
import { B1Api, B1ApiResponse } from "@/utility/b1-api";
import { DateTime } from "@/utility/date-time";
import { Generator } from "@/utility/generator";
import NotificationFCM from "@/utility/notification/notification";
import { getTokensByUserId } from "@/data/clients-sessions";

// eslint-disable-next-line max-len
import { InvoicePaymentRepository } from "@/repositories/invoice-payment-repository";
import { UserRepository } from "@/repositories/user-repository";
import { SessionRecord } from "@/records/session-record";
import { RequestRepository } from "@/repositories/request-repository";
import { transactionService } from "../transaction-service";

type Props = {
  requestRepository: RequestRepository;
  invoicePaymentRepository: InvoicePaymentRepository;
  userRepository: UserRepository;
};

type Input = {
  paymentId: string;
  remarks?: string | null;
  status: "PAID" | "UNPAID" | "DECLINED";
};

export class ConfirmInvoicePaymentService {
  protected _requestRepository: RequestRepository;
  protected _invoicePaymentRepository: InvoicePaymentRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._invoicePaymentRepository = props.invoicePaymentRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<unknown, Failure>> {
    const paymentId = Attribute.make(input.paymentId);
    const remarks = Attribute.make(optional(input.remarks, null));

    const validationBag = ValidationBag.make();

    validationBag.set(
      "paymentId",
      Validation.make(paymentId.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "remarks",
      Validation.make(remarks.get()).optional().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const invoicePaymentRecord = await this._invoicePaymentRepository.getByUuid(
      paymentId.get()
    );

    if (typeof invoicePaymentRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }
    if (invoicePaymentRecord.isConfirmed) {
      return Result.fail(Failure.badRequest("payment-already-confirmed"));
    }

    if (input.status !== "PAID") {
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
        })
      );
    }

    const invoiceDocNum = await B1Api.getDocNumByDocEntry(
      b1Response?.DocEntry ?? "",
      true
    );

    invoicePaymentRecord.callBackAttempted = true;
    invoicePaymentRecord.isFailed = false;

    invoicePaymentRecord.sapMessage = b1Response.DocEntry;
    invoicePaymentRecord.docNum = invoiceDocNum;
    invoicePaymentRecord.sapStatus = true;
    invoicePaymentRecord.retryDate = DateTime.now().toString();

    invoicePaymentRecord.isConfirmed = true;
    invoicePaymentRecord.confirmedAt = DateTime.now().toString();
    invoicePaymentRecord.remarks = remarks.get();

    await this._invoicePaymentRepository.Update(invoicePaymentRecord);

    await transactionService.logInvoicePaymentConfirmed(
      invoicePaymentRecord,
      b1Response.DocEntry
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
          customerTokens
        ));
    }

    return Result.ok(undefined);
  }
}

type PartialPaymentData = {
  status: string;
  docEntry: string;
};
