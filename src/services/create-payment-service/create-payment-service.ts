import { Result } from "@/utility/result";

import { Failure } from "@/utility/failure";
import { Validation } from "@/utility/validation";
import { ValidationBag } from "@/utility/validation-bag";
import { FibApi } from "@/utility/fib-api";
import { ValidationRule } from "@/utility/validation-rule";
import { Generator } from "@/utility/generator";
import { B1Api } from "@/utility/b1-api";
import { DateTime } from "@/utility/date-time";

import {
  IPaymentRecord,
  PaymentMethod,
  IPaymentItemRecord,
  Payment,
  PaymentItem,
} from "@/schemas/payment-schema";
import { SessionRecord } from "@/records/session-record";

import { RequestRepository } from "@/repositories/request-repository";
import { PaymentRepository } from "@/repositories/payment-repository";
import { UserRepository } from "@/repositories/user-repository";
import { transactionService } from "../transaction-service";
import { fibStatusCallbackUrl } from "@/config/app";

type Props = {
  requestRepository: RequestRepository;
  paymentRepository: PaymentRepository;
  userRepository: UserRepository;
};

type Input = {
  requests: {
    id: string;
    amount: number;
  }[];
  method?: "fib" | "credit-card" | "fast-pay";
  remarks?: string;
  date?: string;
  sessionRecord: SessionRecord;
  commissionAmount: string;
};

export class CreatePaymentService {
  protected _requestRepository: RequestRepository;
  protected _paymentRepository: PaymentRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._paymentRepository = props.paymentRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<unknown, Failure>> {
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
      Validation.make(input.requests).mandatory().array().getRule()
    );
    validationBag.set(
      "date",
      Validation.make(input.date).optional().date().getRule()
    );
    validationBag.set(
      "remarks",
      Validation.make(input.remarks).optional().string().getRule()
    );
    validationBag.set(
      "commissionAmount",
      Validation.make(input.commissionAmount).mandatory().string().getRule()
    );

    const requestsAmounts: Record<string, number> = {};

    if (!validationBag.hasError("requests")) {
      for (const [index, request] of input.requests.entries()) {
        requestsAmounts[request.id] = request.amount;

        validationBag.set(
          `requests.id.${index}`,
          Validation.make(request.id).mandatory().string().getRule()
        );
        validationBag.set(
          `requests.amount.${index}`,
          Validation.make(request.amount).mandatory().number().getRule()
        );
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    if (input.requests.length === 0) {
      validationBag.set(
        "requests",
        ValidationRule.valueIsInvalid("Requests list is empty.")
      );
      return Result.fail(Failure.validation(validationBag));
    }

    const requestsIds = Object.keys(requestsAmounts);

    if (requestsIds.length !== input.requests.length) {
      validationBag.set(
        "requests",
        ValidationRule.valueIsInvalid(
          "List contains one or more duplicate requests"
        )
      );
      return Result.fail(Failure.validation(validationBag));
    }

    const requestsRecords = await this._requestRepository.getAll({
      ids: requestsIds,
    });

    if (requestsRecords.length !== requestsIds.length) {
      validationBag.set(
        "requestsIds",
        ValidationRule.valueIsInvalid(
          "One or more requests are not found in the list"
        )
      );
      return Result.fail(Failure.validation(validationBag));
    }

    let totalAmount = 0;
    const paymentItemsRecords: IPaymentItemRecord[] = [];
    let row = 0;
    let customerName = "";
    let customerId = "";
    let customerCode = "";
    const treatedIds: Record<string, boolean> = {};
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
            "List contains one or more non-payable requests."
          )
        );
        return Result.fail(Failure.validation(validationBag));
      }
      if (requestRecord.totalPayments === requestRecord.totalPrice) {
        validationBag.set(
          "requests",
          ValidationRule.valueIsInvalid(
            "List contains one or more already paid requests."
          )
        );
        return Result.fail(Failure.validation(validationBag));
      }

      const newAmount =
        requestsAmounts[requestRecord.id] + requestRecord.totalPayments;
      if (newAmount > requestRecord.totalPrice) {
        validationBag.set(
          "requests",
          ValidationRule.valueIsInvalid(
            "List contains one or more over-payments."
          )
        );
        return Result.fail(Failure.validation(validationBag));
      }

      const paymentItemRecord = new PaymentItem({
        row: row++,
        requestId: requestRecord.id,
        staffId: requestRecord.staffId,
        categoryName: requestRecord.categoryName,
        totalAmount: requestsAmounts[requestRecord.id],
      });

      paymentItemsRecords.push(paymentItemRecord);

      treatedIds[requestRecord.id] = true;
      totalAmount += requestsAmounts[requestRecord.id];

      customerId = requestRecord.customerId;
      customerCode = requestRecord.customerCode;
      customerName = requestRecord.customerName;
    }

    if (Number.isNaN(totalAmount) || totalAmount === 0) {
      return Result.fail(Failure.badRequest("invalid-amount"));
    }

    const userRecord = await this._userRepository.get(
      input.sessionRecord.userId
    );

    const requestIds = requestsRecords.map((record) => record.id).join(",");

    if (method === "fib") {
      const ID = Generator.uuid("R");
      const paymentDataResult = await FibApi.createPayment({
        amount: String(totalAmount),
        currency: "IQD",
        description: `Payment of ${input.requests.length} requests. ${requestIds}`,
        ID,
        statusCallbackUrl: `${fibStatusCallbackUrl}/${ID}`,
      });
      if (paymentDataResult.hasFailed()) {
        return Result.fail(
          Failure.make({
            code: "payment-failed",
            data: paymentDataResult.getFailure(),
          })
        );
      }
      const paymentData = paymentDataResult.getValue() as { paymentId: string };

      const paymentRecord = new Payment({
        uuid: ID,
        id: paymentData.paymentId,
        customerId,
        customerCode,
        staffId: null,
        staffName: null,
        customerName,
        requestsIds,
        totalAmount,
        commissionAmount: input.commissionAmount,
        submittedAmount: 0,
        method,
        createdAt: input.date || DateTime.now().toString(),
        isConfirmed: false,
        confirmedAt: null,
        isSubmitted: false,
        submittedAt: null,
        remarks: input.remarks,
        sapMessage: "Pending",
        sapStatus: false,
      });

      await this._paymentRepository.Create(
        paymentRecord,
        paymentItemsRecords,
        PaymentItem,
        "items"
      );

      await transactionService.logPaymentCreated(paymentRecord);

      return Result.ok(paymentDataResult.getValue());
    }

    if (["cash", "credit-card", "fast-pay"].includes(method)) {
      const paymentRecord = new Payment({
        id: Generator.id("P"),
        customerId,
        customerCode,
        customerName,
        staffId: input.sessionRecord.userId,
        staffName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
        requestsIds,
        totalAmount,
        commissionAmount: input.commissionAmount,
        submittedAmount: 0,
        items: [],
        method,
        createdAt: input.date || DateTime.now().toString(),
        isConfirmed: true,
        confirmedAt: input.date || DateTime.now().toString(),
        isSubmitted: false,
        submittedAt: null,
        remarks: input.remarks,
        sapMessage: "Completed",
        sapStatus: true,
      });

      // try {
      //   await B1Api.createInvoice({
      //     requestsRecords,
      //     paymentRecord,
      //     salespersonId: userRecord ? userRecord.salespersonId : undefined,
      //   });
      // } catch (error: unknown) {
      //   return Result.fail(
      //     Failure.make({
      //       code: "b1-error",
      //       data: error,
      //     })
      //   );
      // }
      await this._paymentRepository.Create(
        paymentRecord,
        paymentItemsRecords,
        PaymentItem,
        "items"
      );
      const paymentData = await this._paymentRepository.get(paymentRecord.id);

      await transactionService.logPaymentCreated(paymentRecord);

      await this._requestRepository.pay(paymentData);
      return Result.ok(paymentRecord.id);
    }

    if (method === "credit") {
      const paymentRecord = new Payment({
        id: Generator.id("P"),
        customerId,
        customerCode,
        customerName,
        staffId: null,
        staffName: null,
        requestsIds,
        totalAmount,
        commissionAmount: input.commissionAmount,
        submittedAmount: 0,
        items: [],
        method,
        createdAt: input.date || DateTime.now().toString(),
        isConfirmed: true,
        confirmedAt: input.date || DateTime.now().toString(),
        isSubmitted: false,
        submittedAt: null,
        remarks: input.remarks,
        sapMessage: "Completed",
        sapStatus: true,
      });
      try {
        await B1Api.createInvoice({
          requestsRecords,
          paymentRecord,
          salespersonId: userRecord ? userRecord.salespersonId : undefined,
        });
      } catch (error: unknown) {
        console.error(error);
        return Result.fail(
          Failure.make({
            code: "b1-error",
            data: error,
          })
        );
      }
      await this._paymentRepository.Create(
        paymentRecord,
        paymentItemsRecords,
        PaymentItem,
        "items"
      );
      const paymentData = await this._paymentRepository.get(paymentRecord.id);

      await transactionService.logPaymentCreated(paymentRecord);

      await this._requestRepository.pay(paymentData);
      return Result.ok(paymentRecord.id);
    }

    return Result.fail(Failure.badRequest("invalid-payment-type"));
  }
}
