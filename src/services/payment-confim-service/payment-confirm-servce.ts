import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";
import { DateTime } from "@/utility/date-time";
import { PaymentRepository } from "@/repositories/payment-repository";
import { RequestRepository } from "@/repositories/request-repository";
import { UserRepository } from "@/repositories/user-repository";
import { B1Api } from "@/utility/b1-api";
import { getTokensByUserId } from "@/data/clients-sessions";
import NotificationFCM from "@/utility/notification/notification";
import { Generator } from "@/utility/generator";
import { transactionService } from "../transaction-service";

type Input = {
  paymentId: string;
  id: string;
  status: "PAID" | "UNPAID" | "DECLINED";
};

type Props = {
  requestRepository: RequestRepository;
  paymentRepository: PaymentRepository;
  userRepository: UserRepository;
};

export class PaymentConfirmService {
  protected _requestRepository: RequestRepository;
  protected _paymentRepository: PaymentRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._paymentRepository = props.paymentRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<any, Failure>> {
    const paymentId = Attribute.make(input.paymentId);
    const validationBag = ValidationBag.make();

    validationBag.set(
      "paymentId",
      Validation.make(paymentId.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const paymentRecord = await this._paymentRepository.getByUuid(
      paymentId.get()
    );

    if (typeof paymentRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    if (paymentRecord.isConfirmed) {
      return Result.fail(Failure.make({ code: "Payment Already Confirmed" }));
    }

    if (input.status !== "PAID") {
      paymentRecord.callBackAttempted = true;
      paymentRecord.isFailed = true;
      await this._paymentRepository.Update(paymentRecord);

      await transactionService.logPaymentFailed(
        paymentRecord,
        `Payment status: ${input.status}`
      );

      return Result.fail(Failure.paymentFailed());
    }

    const requestsRecords = await this._requestRepository.getAll({
      ids: paymentRecord.requestsIds,
    });

    let salespersonId: string | null = null;
    if (paymentRecord.staffId !== null) {
      const staffRecord = await this._userRepository.get(paymentRecord.staffId);
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
      console.error(error);

      paymentRecord.callBackAttempted = false;
      paymentRecord.isFailed = false;

      paymentRecord.isConfirmed = false;
      paymentRecord.confirmedAt = DateTime.now().toString();

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

    paymentRecord.callBackAttempted = true;
    paymentRecord.isFailed = false;

    paymentRecord.isConfirmed = true;
    paymentRecord.confirmedAt = DateTime.now().toString();
    paymentRecord.sapMessage = b1ResponseData.DocEntry;
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
          customerTokens
        ));
    }

    await this._paymentRepository.Update(paymentRecord);
    await this._requestRepository.pay(paymentRecord);

    await transactionService.logPaymentConfirmed(
      paymentRecord,
      b1ResponseData.DocEntry
    );

    return Result.ok(undefined);
  }
}
