import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { FibApi } from "@/utility/fib-api";
import { ValidationBag } from "@/utility/validation-bag";
import { optional } from "@/utility/optional";
import { B1Api } from "@/utility/b1-api";
import { DateTime } from "@/utility/date-time";

import { RequestRepository } from "@/repositories/request-repository";
import { PaymentRepository } from "@/repositories/payment-repository";
import { UserRepository } from "@/repositories/user-repository";
import { SessionRecord } from "@/records/session-record";
import { transactionService } from "../transaction-service";

//
//
//
//
// this file is not used for confirm status
//
//
//
type Props = {
  requestRepository: RequestRepository;
  paymentRepository: PaymentRepository;
  userRepository: UserRepository;
};

type Input = {
  id: string;
  amount: number;
  remarks?: string | null;
  sessionRecord: SessionRecord;
};

export class ConfirmPaymentService {
  protected _requestRepository: RequestRepository;
  protected _paymentRepository: PaymentRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._paymentRepository = props.paymentRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<unknown, Failure>> {
    const id = Attribute.make(input.id);
    const remarks = Attribute.make(optional(input.remarks, null));
    const amount = Attribute.make(input.amount);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "id",
      Validation.make(id.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "remarks",
      Validation.make(remarks.get()).optional().string().getRule()
    );
    if (input.sessionRecord.role === "manager") {
      validationBag.set(
        "amount",
        Validation.make(amount.get()).mandatory().number().getRule()
      );
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const paymentRecord = await this._paymentRepository.get(id.get());
    if (typeof paymentRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }
    if (paymentRecord.method === "credit") {
      return Result.fail(Failure.notFound());
    }
    if (
      input.sessionRecord.role === "customer" &&
      paymentRecord.customerId !== input.sessionRecord.userId
    ) {
      return Result.fail(Failure.notFound());
    }

    let salespersonId: string | null = null;
    if (paymentRecord.staffId !== null) {
      const staffRecord = await this._userRepository.get(paymentRecord.staffId);
      if (typeof staffRecord === "undefined") {
        return Result.fail(Failure.badRequest());
      }
      salespersonId = staffRecord.salespersonId;
    }

    paymentRecord.remarks = remarks.get();

    if (input.sessionRecord.role === "manager") {
      paymentRecord.isSubmitted = true;
      paymentRecord.submittedAt = DateTime.now().toString();
      paymentRecord.submittedAmount = amount.get();

      await transactionService.logPaymentSubmitted(paymentRecord);
    }

    if (["fib", "credit-card", "fast-pay"].includes(paymentRecord.method)) {
      paymentRecord.isConfirmed = true;
      paymentRecord.confirmedAt = DateTime.now().toString();

      const paymentDataResult = await FibApi.checkPayment(paymentRecord.id);
      if (paymentDataResult.hasFailed()) {
        return Result.fail(
          Failure.make({
            code: "payment-check-failed",
            data: paymentDataResult.getFailure(),
          })
        );
      }

      const paymentData = paymentDataResult.getValue() as PartialPaymentData;

      if (paymentData.status !== "PAID") {
        paymentData;
        return Result.fail(Failure.badRequest(paymentData));
      }

      const requestsRecords = await this._requestRepository.getAll({
        ids: paymentRecord.requestsIds,
      });

      let b1ResponseData;
      try {
        b1ResponseData = await B1Api.createInvoice({
          requestsRecords,
          paymentRecord,
          salespersonId,
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

      await this._requestRepository.pay(paymentRecord);
      await this._paymentRepository.Update(paymentRecord);

      await transactionService.logPaymentConfirmed(
        paymentRecord,
        b1ResponseData.DocEntry
      );

      paymentData.docEntry = b1ResponseData.DocEntry;
      return Result.ok(paymentData);
    }

    await this._paymentRepository.Update(paymentRecord);

    return Result.ok(paymentRecord);
  }
}

type PartialPaymentData = {
  status: string;
  docEntry: string;
};
