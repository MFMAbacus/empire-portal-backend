import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";
import { FibApi } from "@/utility/fib-api";
import { FastPayApi } from "@/utility/fastPay-api";

import { fibInvoiceStatusCallbackUrl, storeId, storePass } from "@/config/app";

import { InvoicePaymentRepository } from "@/repositories/invoice-payment-repository";

import { ISessionRecord } from "@/schemas/session-schema";
import { IInvoicePaymentItemRecord } from "@/schemas/invoice-payment-schema/invoice-payment-item";
import {
  InvoicePayment,
  InvoicePaymentItem,
} from "@/schemas/invoice-payment-schema";
import { transactionService } from "../transaction-service";
import { HyperPayApi } from "@/utility/hyperpay-api/hyperpay-api";
import { DeviceType } from "@/types/general";

type Props = {
  invoicePaymentRepository: InvoicePaymentRepository;
};

type CartItem = {
  name: string;
  qty: number;
  unit_price: number;
  sub_total: number;
};

type Input = {
  sessionRecord: ISessionRecord;
  invoices: {
    type: string;
    sapInvoiceId: string;
    amount: number;
    date: string;
    cardCode: string;
  }[];
  commissionAmount: string;
  method: "fib" | "credit-card" | "fast-pay";
  remarks?: string;
  deviceType?: string;
};

export class CreateInvoicePaymentService {
  protected _invoicePaymentRepository: InvoicePaymentRepository;

  public constructor(props: Props) {
    this._invoicePaymentRepository = props.invoicePaymentRepository;
  }

  public async execute(input: Input): Promise<Result<unknown, Failure>> {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "remarks",
      Validation.make(input.remarks).optional().string().getRule(),
    );
    validationBag.set(
      "commissionAmount",
      Validation.make(input.remarks).mandatory().string().getRule(),
    );
    validationBag.set(
      "invoices",
      Validation.make(input.invoices).mandatory().array().getRule(),
    );
    validationBag.set(
      "method",
      Validation.make(input.method)
        .mandatory()
        .string({
          pattern: /^(fib|credit-card|fast-pay)$/,
        })
        .getRule(),
    );

    const items: IInvoicePaymentItemRecord[] = [];
    const cart: CartItem[] = [];
    const sapInvoiceIds: string[] = [];

    let totalAmount = 0;
    if (!validationBag.hasError("invoices")) {
      for (const [index, invoice] of input.invoices.entries()) {
        validationBag.set(
          `invoices.type.${index}`,
          Validation.make(invoice.type).mandatory().string().getRule(),
        );
        validationBag.set(
          `invoices.sapInvoiceId.${index}`,
          Validation.make(invoice.sapInvoiceId).mandatory().string().getRule(),
        );
        validationBag.set(
          `invoices.amount.${index}`,
          Validation.make(invoice.amount).mandatory().number().getRule(),
        );
        validationBag.set(
          `invoices.date.${index}`,
          Validation.make(invoice.date).mandatory().date().getRule(),
        );
        validationBag.set(
          `invoices.cardCode.${index}`,
          Validation.make(invoice.cardCode).mandatory().string().getRule(),
        );

        const paymentItemRecord = new InvoicePaymentItem({
          id: Generator.shortToken(),
          type: invoice.type,
          sapInvoiceId: invoice.sapInvoiceId,
          cardCode: invoice.cardCode,
          amount: invoice.amount,
          date: invoice.date,
        });
        items.push(paymentItemRecord);
        sapInvoiceIds.push(invoice.sapInvoiceId);

        cart.push({
          name: invoice.type,
          qty: 1,
          unit_price: invoice.amount,
          sub_total: invoice.amount,
        });
        // items.push({
        //   id: Generator.shortToken(),
        //   type: invoice.type,
        //   sapInvoiceId: invoice.sapInvoiceId,
        //   cardCode: invoice.cardCode,
        //   amount: invoice.amount,
        //   date: invoice.date,
        // });

        totalAmount += invoice.amount;
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    if (Number.isNaN(totalAmount) || totalAmount <= 0) {
      return Result.fail(Failure.badRequest("invalid-total-amount"));
    }

    const invocieIds = input.invoices.map((inv) => inv.sapInvoiceId).join(",");

    const ID = Generator.uuid("I");
    if (input.method === "fib") {
      const paymentDataResult = await FibApi.createPayment({
        amount: String(totalAmount),
        currency: "IQD",
        description: `Payment of ${input.invoices.length} invoices. ${invocieIds}`,
        ID,
        statusCallbackUrl: `${fibInvoiceStatusCallbackUrl}/${ID}/confirm`,
      });
      if (paymentDataResult.hasFailed()) {
        return Result.fail(
          Failure.make({
            code: "invoice-payment-failed",
            data: paymentDataResult.getFailure(),
          }),
        );
      }
      const paymentData = paymentDataResult.getValue();

      const paymentRecord = new InvoicePayment({
        uuid: ID,
        id: (paymentData as { paymentId: string }).paymentId,
        customerId: input.sessionRecord.userId,
        customerName:
          input.sessionRecord.firstName + " " + input.sessionRecord.lastName,
        totalAmount,
        commissionAmount: input.commissionAmount,
        sapInvoiceIds,
        method: input.method,
        createdAt: DateTime.now().toString(),
        isConfirmed: false,
        confirmedAt: null,
        remarks: input.remarks,
        sapMessage: "Pending",
        sapStatus: false,
        deviceType:
          input.deviceType === DeviceType.ANDROID
            ? DeviceType.ANDROID
            : DeviceType.IOS,
      });

      await this._invoicePaymentRepository.Create(
        paymentRecord,
        items,
        InvoicePaymentItem,
        "items",
      );

      await transactionService.logInvoicePaymentCreated(paymentRecord);

      return Result.ok(paymentData);
    } else if (input.method === "fast-pay") {
      const order_id = Generator.uuid("I");

      const paymentDataResult = await FastPayApi.createPayment({
        store_id: storeId,
        store_password: storePass,
        order_id,
        bill_amount: totalAmount,
        currency: "IQD",
        cart: JSON.stringify(cart),
      });

      if (paymentDataResult.hasFailed()) {
        return Result.fail(
          Failure.make({
            code: "invoice-payment-failed",
            data: paymentDataResult.getFailure(),
          }),
        );
      }
      const paymentData = paymentDataResult.getValue();

      const paymentRecord = new InvoicePayment({
        uuid: order_id,
        id: order_id,
        customerId: input.sessionRecord.userId,
        customerName:
          input.sessionRecord.firstName + " " + input.sessionRecord.lastName,
        commissionAmount: input.commissionAmount,
        totalAmount,
        sapInvoiceIds,
        method: input.method,
        createdAt: DateTime.now().toString(),
        isConfirmed: false,
        confirmedAt: null,
        remarks: input.remarks,
        sapMessage: "Pending",
        sapStatus: false,
        deviceType:
          input.deviceType === DeviceType.ANDROID
            ? DeviceType.ANDROID
            : DeviceType.IOS,
      });

      await this._invoicePaymentRepository.Create(
        paymentRecord,
        items,
        InvoicePaymentItem,
        "items",
      );

      await transactionService.logInvoicePaymentCreated(paymentRecord);

      return Result.ok(paymentDataResult.getValue());
    } else if (input.method === "credit-card") {
      const order_id = Generator.uuid("I");

      const checkoutResult = await HyperPayApi.createCheckout({
        amount: totalAmount.toFixed(2),
        currency: "IQD",
        merchantTransactionId: order_id,
        customerEmail: undefined,
        customerName: undefined,
        description: `Payment of ${input.invoices.length} requests`,
      });

      if (checkoutResult.hasFailed()) {
        return Result.fail(
          Failure.make({
            code: "invoice-payment-failed",
            data: checkoutResult.getFailure(),
          }),
        );
      }
      const paymentData = checkoutResult.getValue();

      const paymentRecord = new InvoicePayment({
        uuid: order_id,
        id: paymentData.id,
        customerId: input.sessionRecord.userId,
        customerName:
          input.sessionRecord.firstName + " " + input.sessionRecord.lastName,
        commissionAmount: input.commissionAmount,
        totalAmount,
        sapInvoiceIds,
        method: input.method,
        createdAt: DateTime.now().toString(),
        isConfirmed: false,
        confirmedAt: null,
        remarks: input.remarks,
        sapMessage: "Pending",
        sapStatus: false,
        deviceType:
          input.deviceType === DeviceType.ANDROID
            ? DeviceType.ANDROID
            : DeviceType.IOS,
      });

      await this._invoicePaymentRepository.Create(
        paymentRecord,
        items,
        InvoicePaymentItem,
        "items",
      );

      await transactionService.logInvoicePaymentCreated(paymentRecord);

      return Result.ok({
        checkoutId: paymentData.id,
        success: true,
        scriptUrl: paymentData.script_url,
        merchantTransactionId: order_id,
      });
    }
    return Result.fail(Failure.badRequest("invalid-payment-type"));
  }
}
