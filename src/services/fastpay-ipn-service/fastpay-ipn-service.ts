/* eslint-disable linebreak-style */
import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";
import { storeId, storePass } from "@/config/app";
import { FastPayApi } from "@/utility/fastPay-api";
import { DateTime } from "@/utility/date-time";
import { InvoicePaymentRepository } from "@/repositories/invoice-payment-repository";
import { PaymentRepository } from "@/repositories/payment-repository";
import { RequestRepository } from "@/repositories/request-repository";
import { UserRepository } from "@/repositories/user-repository";
import { B1Api } from "@/utility/b1-api";
import NotificationFCM from "@/utility/notification/notification";
import { Generator } from "@/utility/generator";
import { getTokensByUserId } from "@/data/clients-sessions";
import { B1ApiResponse } from "@/utility/b1-api";
import { transactionService } from "../transaction-service";

type Input = {
  order_id: string;
  status: string;
};

type Props = {
  requestRepository: RequestRepository;
  paymentRepository: PaymentRepository;
  userRepository: UserRepository;
  invoicePaymentRepository: InvoicePaymentRepository;
};

export class FastpayIpnService {
  protected _requestRepository: RequestRepository;
  protected _paymentRepository: PaymentRepository;
  protected _userRepository: UserRepository;
  protected _invoicePaymentRepository: InvoicePaymentRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._paymentRepository = props.paymentRepository;
    this._userRepository = props.userRepository;
    this._invoicePaymentRepository = props.invoicePaymentRepository;
  }

  public async execute(input: Input): Promise<Result<any, Failure>> {
    const order_id = Attribute.make(input.order_id);
    const orderStatus = Attribute.make(input.status);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "order_id",
      Validation.make(order_id.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "orderStatus",
      Validation.make(orderStatus.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    if (order_id.get().startsWith("R", 0)) {
      const paymentRecord = await this._paymentRepository.get(order_id.get());

      if (typeof paymentRecord === "undefined") {
        return Result.fail(Failure.notFound());
      }

      if (paymentRecord.isConfirmed) {
        return Result.fail(Failure.make({ code: "Payment Already Confirmed" }));
      }

      if (orderStatus.get() !== "Success") {
        paymentRecord.isFailed = true;
        paymentRecord.callBackAttempted = true;
        await this._paymentRepository.Update(paymentRecord);
        return Result.fail(Failure.paymentFailed());
      }
      const requestsRecords = await this._requestRepository.getAll({
        ids: paymentRecord.requestsIds,
      });

      requestsRecords.map(async (item) => {
        if (item.paymentStatus !== "Paid") {
          let salespersonId: string | null = null;
          if (paymentRecord.staffId !== null) {
            const staffRecord = await this._userRepository.get(
              paymentRecord.staffId
            );
            if (typeof staffRecord === "undefined") {
              return Result.fail(Failure.badRequest());
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
          } catch (error: any) {
            paymentRecord.isFailed = false;
            paymentRecord.callBackAttempted = false;

            paymentRecord.sapMessage =
              error?.Description ?? "Error During B1 Create Invoice";
            paymentRecord.sapStatus = false;
            paymentRecord.retryDate = DateTime.now().toString();

            await this._paymentRepository.Update(paymentRecord);

            await transactionService.logB1CreateInvoiceFailed(
              paymentRecord,
              paymentRecord.sapMessage ?? ""
            );

            return Result.fail(
              Failure.make({
                code: "b1-error",
                data: error,
              })
            );
          }

          const invocieDocNum = await B1Api.getDocNumByDocEntry(
            b1ResponseData?.DocEntry ?? ""
          );

          paymentRecord.isFailed = false;
          paymentRecord.callBackAttempted = true;

          paymentRecord.isConfirmed = true;
          paymentRecord.confirmedAt = DateTime.now().toString();
          paymentRecord.sapMessage = b1ResponseData.DocEntry;
          paymentRecord.docNum = invocieDocNum;
          paymentRecord.sapStatus = true;

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
                customerTokens
              ));
          }

          await this._paymentRepository.Update(paymentRecord);
          await this._requestRepository.pay(paymentRecord);
        }
      });

      return Result.ok(undefined);
    } else {
      const invoicePaymentRecord =
        await this._invoicePaymentRepository.getByUuid(order_id.get());

      if (typeof invoicePaymentRecord === "undefined") {
        return Result.fail(Failure.notFound());
      }

      if (invoicePaymentRecord.isConfirmed) {
        return Result.fail(Failure.make({ code: "Payment Already Confirmed" }));
      }

      if (orderStatus.get() !== "Success") {
        invoicePaymentRecord.isFailed = true;
        invoicePaymentRecord.callBackAttempted = true;
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
      } catch (error: unknown) {
        console.error(error);

        invoicePaymentRecord.callBackAttempted = false;
        invoicePaymentRecord.isFailed = false;

        invoicePaymentRecord.sapMessage = "Error During B1 Pay Invoice";
        invoicePaymentRecord.sapStatus = false;
        invoicePaymentRecord.retryDate = DateTime.now().toString();

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
      invoicePaymentRecord.isConfirmed = true;
      invoicePaymentRecord.confirmedAt = DateTime.now().toString();
      invoicePaymentRecord.sapMessage = b1Response.DocEntry;
      invoicePaymentRecord.docNum = invoiceDocNum;
      invoicePaymentRecord.sapStatus = true;

      if (invoicePaymentRecord.customerId) {
        const customerTokens = getTokensByUserId(
          invoicePaymentRecord.customerId
        );
        console.log("customer tokens =>", customerTokens);

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

      await this._invoicePaymentRepository.Update(invoicePaymentRecord);

      return Result.ok(undefined);
    }
  }
}
