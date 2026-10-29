import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { DateTime } from "@/utility/date-time";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { HyperPayApi } from "@/utility/hyperpay-api";
import { SessionRecord } from "@/records/session-record";
import { ValidationRule } from "@/utility/validation-rule";
import { Generator } from "@/utility/generator";
import { RequestRepository } from "@/repositories/request-repository";
import { PaymentRepository } from "@/repositories/payment-repository";
import { UserRepository } from "@/repositories/user-repository";

import {
  PaymentMethod,
  IPaymentItemRecord,
  PaymentItem,
  Payment,
} from "@/schemas/payment-schema";
import { transactionService } from "../transaction-service";
import { DeviceType } from "@/types/general";
import { CardPaymentHelper } from "@/utility/card-payment-helper";
import CardProcessingMaster from "@/schemas/card-processing-master-schema/card-processing-master-schema";

type Input = {
  sessionRecord: SessionRecord;
  method: "credit-card";
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

type Props = {
  requestRepository: RequestRepository;
  paymentRepository: PaymentRepository;
  userRepository: UserRepository;
};

export class HyperPayPaymentService {
  protected _requestRepository: RequestRepository;
  protected _paymentRepository: PaymentRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._paymentRepository = props.paymentRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<any, Failure>> {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "requests",
      Validation.make(input.requests).mandatory().array().getRule(),
    );
    validationBag.set(
      "commissionAmount",
      Validation.make(input.commissionAmount).mandatory().string().getRule(),
    );
    validationBag.set(
      "date",
      Validation.make(input.date).optional().date().getRule(),
    );
    validationBag.set(
      "remarks",
      Validation.make(input.remarks).optional().string().getRule(),
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

    const normalRequestIds = requestsIds.filter((id) => !CardPaymentHelper.isCardRequest(id));
    const cardRequestIds = requestsIds.filter((id) => CardPaymentHelper.isCardRequest(id));
    const cardRecords = cardRequestIds.length > 0 ? await CardPaymentHelper.getCardRequests(cardRequestIds) : [];
    const requestsRecords = normalRequestIds.length > 0 ? await this._requestRepository.getAll({ ids: normalRequestIds }) : []; const _cleanResult = (() => {
    if (requestsRecords.length + cardRecords.length !== requestsIds.length) {
      validationBag.set("requestsIds", ValidationRule.valueIsInvalid("One or more requests are not found in the list"));
      return Result.fail(Failure.validation(validationBag));
    }
    });

    const _validationFailure = _cleanResult();
    if (_validationFailure) {
      return _validationFailure;
    }
    const paymentItemsRecords: IPaymentItemRecord[] = [];
    let row = 0;
    let totalAmount = 0;
    let customerName = "";
    let customerId = "";
    let customerCode = "";
    const treatedIds: Record<string, boolean> = {};

    for (const requestRecord of requestsRecords) {
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

      treatedIds[requestRecord.id] = true;
      totalAmount += requestsAmounts[requestRecord.id];

      customerId = requestRecord.customerId;
      customerCode = requestRecord.customerCode;
      customerName = requestRecord.customerName;
    }

    for (const cardRecord of cardRecords) {
      if (cardRecord.paymentStatus === "Paid") {
        validationBag.set(
          "requests",
          ValidationRule.valueIsInvalid(
            "List contains one or more already paid requests.",
          ),
        );
        return Result.fail(Failure.validation(validationBag));
      }

      const cardAmount =
        requestsAmounts[cardRecord.requestId] ??
        requestsAmounts[cardRecord.id] ??
        cardRecord.totalFee ??
        cardRecord.feeAmount ??
        0;

      const item = new PaymentItem({
        row: row++,
        requestId: cardRecord.requestId || cardRecord.id,
        staffId: null,
        categoryName: "Access Card Replacement",
        totalAmount: cardAmount,
      });

      paymentItemsRecords.push(item);

      treatedIds[cardRecord.requestId || cardRecord.id] = true;
      totalAmount += cardAmount;

      if (!customerId) {
        customerId = cardRecord.residentId;
        customerCode = cardRecord.residentId;
        customerName = cardRecord.residentName || "Resident";
      }
    }

    if (Number.isNaN(totalAmount) || totalAmount === 0) {
      return Result.fail(Failure.badRequest("invalid-amount"));
    }

    const merchantTransactionId = Generator.uuid("R");
    const requestIds = requestsRecords.map((record) => record.id).join(",");

    const checkoutResult = await HyperPayApi.createCheckout({
      amount: totalAmount.toFixed(2),
      currency: "IQD",
      merchantTransactionId,
      customerEmail: undefined,
      customerName: undefined,
      description: `Payment of ${input.requests.length} requests ${requestIds}`,
    });

    if (checkoutResult.hasFailed()) {
      return Result.fail(
        Failure.make({
          code: "hyperpay-checkout-failed",
          data: checkoutResult.getFailure(),
        }),
      );
    }

    const checkoutData = checkoutResult.getValue();

    const paymentRecord = new Payment({
      uuid: merchantTransactionId,
      id: checkoutData.id,
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
      method: "credit-card" as PaymentMethod,
      createdAt: input.date || DateTime.now().toString(),
      isConfirmed: false,
      confirmedAt: null,
      isSubmitted: false,
      submittedAt: null,
      remarks: input.remarks,
      sapMessage: "Pending HyperPay Confirmation",
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

    if (cardRecords.length > 0) {
      await CardProcessingMaster.updateMany(
        { $or: [{ requestId: { $in: cardRequestIds } }, { id: { $in: cardRequestIds } }] },
        { $set: { paymentStatus: "Pending", paymentMethod: "Credit Card" } }
      );
    }

    requestsRecords.map((request) => {
      request.paymentStatus = "Pending";
      this._requestRepository.Update(request);
    });

    await transactionService.logPaymentCreated(paymentRecord);

    return Result.ok({
      checkoutId: checkoutData.id,
      success: true,
      scriptUrl: checkoutData.script_url,
      merchantTransactionId,
    });
  }
}
