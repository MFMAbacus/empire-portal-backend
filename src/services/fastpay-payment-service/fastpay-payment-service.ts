import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { DateTime } from "@/utility/date-time";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { FastPayApi } from "@/utility/fastPay-api";
import { SessionRecord } from "@/records/session-record";
import { InvoicePaymentRepository } from "@/repositories/invoice-payment-repository";
import { storeId, storePass } from "@/config/app";
import {
  PaymentMethod,
  IPaymentItemRecord,
  PaymentItem,
} from "@/schemas/payment-schema";
import { ValidationRule } from "@/utility/validation-rule";
import { Generator } from "@/utility/generator";
import { RequestRepository } from "@/repositories/request-repository";
import { PaymentRepository } from "@/repositories/payment-repository";
import { UserRepository } from "@/repositories/user-repository";

import { IRequestItemRecord, RequestPayment } from "@/schemas/request-schema";
import { B1Api } from "@/utility/b1-api/b1-api";
import { Payment } from "@/schemas/payment-schema";
import { transactionService } from "../transaction-service";
import { DeviceType } from "@/types/general";

type Input = {
  sessionRecord: SessionRecord;
  method: "fib" | "credit-card" | "fast-pay";
  date?: string;
  remarks?: string;
  requests: {
    amount: number;
    amountPaid: number;
    id: string;
  }[];
  commissionAmount: string;
  deviceType?: string;
};

type CartItem = {
  name: string;
  qty: number;
  unit_price: number;
  sub_total: number;
};

type Props = {
  requestRepository: RequestRepository;
  paymentRepository: PaymentRepository;
  userRepository: UserRepository;
};

export class FastpayPaymentInService {
  protected _requestRepository: RequestRepository;
  protected _paymentRepository: PaymentRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._paymentRepository = props.paymentRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<any, Failure>> {
    const method = ((): PaymentMethod => {
      if (input.sessionRecord.role === "manager") {
        return "credit";
      }
      if (input.sessionRecord.role === "staff") {
        return "cash";
      }
      if (input.method && ["credit-card", "fast-pay"].includes(input.method)) {
        return input.method;
      }
      return "fib";
    })();

    const validationBag = ValidationBag.make();

    validationBag.set(
      "requests",
      Validation.make(input.requests).mandatory().array().getRule(),
    );
    validationBag.set(
      "date",
      Validation.make(input.date).optional().date().getRule(),
    );

    validationBag.set(
      "remarks",
      Validation.make(input.remarks).mandatory().string().getRule(),
    );
    validationBag.set(
      "commissionAmount",
      Validation.make(input.commissionAmount).mandatory().string().getRule(),
    );

    const requestsAmounts: Record<string, number> = {};

    if (!validationBag.hasError("requests")) {
      for (const [index, request] of input.requests.entries()) {
        requestsAmounts[request.id] = request.amount;

        validationBag.set(
          `requests.id.${index}`,
          Validation.make(request.id).mandatory().string().getRule(),
        );
        validationBag.set(
          `requests.amount.${index}`,
          Validation.make(request.amount).mandatory().number().getRule(),
        );
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    if (input.requests.length === 0) {
      validationBag.set(
        "requests",
        ValidationRule.valueIsInvalid("Requests list is empty."),
      );
      return Result.fail(Failure.validation(validationBag));
    }

    let bill_amount = input.requests.reduce(
      (total, request) => total + request.amount,
      0,
    );

    if (bill_amount === 0) {
      validationBag.set(
        "requests",
        ValidationRule.valueIsInvalid(
          "List contains one or more non-payable requests.",
        ),
      );
      return Result.fail(Failure.validation(validationBag));
    }

    const requestsIds = Object.keys(requestsAmounts);

    if (requestsIds.length !== input.requests.length) {
      validationBag.set(
        "requests",
        ValidationRule.valueIsInvalid(
          "List contains one or more duplicate requests",
        ),
      );
      return Result.fail(Failure.validation(validationBag));
    }

    const requestsRecords = await this._requestRepository.getAll({
      ids: requestsIds,
    });

    let totalAmount = 0;
    const paymentItemsRecords: IPaymentItemRecord[] = [];
    let row = 0;
    let customerName = "";
    let customerId = "";
    let customerCode = "";
    const treatedIds: Record<string, boolean> = {};
    const cart: CartItem[] = [];

    for (const requestRecord of requestsRecords) {
      if (
        input.sessionRecord.role === "customer" &&
        requestRecord.customerId !== input.sessionRecord.userId
      ) {
        return Result.fail(Failure.badRequest("customer-not-allowed"));
      }
      if (requestRecord.totalPrice === 0) {
        validationBag.set(
          "requests",
          ValidationRule.valueIsInvalid(
            "List contains one or more non-payable requests.",
          ),
        );
        return Result.fail(Failure.validation(validationBag));
      }
      if (requestRecord.totalPayments === requestRecord.totalPrice) {
        validationBag.set(
          "requests",
          ValidationRule.valueIsInvalid(
            "List contains one or more already paid requests.",
          ),
        );
        return Result.fail(Failure.validation(validationBag));
      }

      const item = new PaymentItem({
        row: row++,
        requestId: requestRecord.id,
        staffId: requestRecord.staffId,
        categoryName: requestRecord.categoryName,
        totalAmount: requestsAmounts[requestRecord.id],
      });

      paymentItemsRecords.push(item);

      requestRecord.items.map((item: IRequestItemRecord) => {
        cart.push({
          name: item.name,
          qty: item.quantity,
          unit_price: item.price,
          sub_total: item.totalPrice,
        });
      });

      treatedIds[requestRecord.id] = true;
      totalAmount += requestsAmounts[requestRecord.id];

      customerId = requestRecord.customerId;
      customerCode = requestRecord.customerCode;
      customerName = requestRecord.customerName;
    }

    if (Number.isNaN(totalAmount) || totalAmount === 0) {
      return Result.fail(Failure.badRequest("invalid-amount"));
    }

    if (method === "fast-pay") {
      const order_id = Generator.uuid("R");

      const paymentDataResult = await FastPayApi.createPayment({
        store_id: storeId,
        store_password: storePass,
        order_id,
        bill_amount,
        currency: "IQD",
        cart: JSON.stringify(cart),
      });

      if (paymentDataResult.hasFailed()) {
        return Result.fail(
          Failure.make({
            code: "payment-failed",
            data: paymentDataResult.getFailure(),
          }),
        );
      }

      const paymentRecord = new Payment({
        id: order_id,
        customerId,
        customerCode,
        staffId: null,
        staffName: null,
        customerName,
        requestsIds,
        totalAmount,
        commissionAmount: input.commissionAmount,
        submittedAmount: 0,
        items: [],
        method,
        createdAt: input.date || DateTime.now().toString(),
        isConfirmed: false,
        confirmedAt: null,
        isSubmitted: false,
        submittedAt: null,
        remarks: input.remarks,
        sapMessage: "Pending",
        sapStatus: false,
        deviceType:
          input.deviceType === DeviceType.ANDROID
            ? DeviceType.ANDROID
            : DeviceType.IOS,
      });

      await this._paymentRepository.Create(
        paymentRecord,
        paymentItemsRecords,
        PaymentItem,
        "items",
      );

      requestsRecords.map((request) => {
        request.paymentStatus = "Pending";
        this._requestRepository.Update(request);
      });

      await transactionService.logPaymentCreated(paymentRecord);

      return Result.ok(paymentDataResult.getValue());
    }

    return Result.ok(undefined);
  }
}
