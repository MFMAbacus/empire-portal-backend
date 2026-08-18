import { Payment } from "@/schemas/payment-schema";
import { RequestRepositoryDb } from "@/repositories/request-repository";
import { PaymentRepositoryDb } from "@/repositories/payment-repository";
import { UserRepositoryDb } from "@/repositories/user-repository";
import { B1Api } from "@/utility/b1-api";
import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { DateTime } from "@/utility/date-time";
import { transactionService } from "../transaction-service";

type Props = {
  requestRepository: RequestRepositoryDb;
  userRepository: UserRepositoryDb;
  paymentRepository: PaymentRepositoryDb;
};

export class RetrySapPostingsService {
  protected _requestRepository: RequestRepositoryDb;
  protected _userRepository: UserRepositoryDb;
  protected _paymentRepository: PaymentRepositoryDb;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._userRepository = props.userRepository;
    this._paymentRepository = props.paymentRepository;
  }

  public async execute(): Promise<void> {
    const payments = await Payment.find({ sapStatus: false });
    if (!payments || payments.length === 0) return;

    for (const paymentRecord of payments) {
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

      try {
        const b1ResponseData = await B1Api.createInvoice({
          requestsRecords,
          paymentRecord,
          salespersonId,
        });

        const invocieDocNum = await B1Api.getDocNumByDocEntry(
          b1ResponseData?.DocEntry ?? ""
        );

        paymentRecord.isConfirmed = true;
        paymentRecord.confirmedAt = DateTime.now().toString();
        paymentRecord.sapMessage = b1ResponseData.DocEntry;
        paymentRecord.docNum = invocieDocNum;
        paymentRecord.sapStatus = true;
        paymentRecord.retryDate = DateTime.now().toString();

        await this._paymentRepository.Update(paymentRecord);
        await this._requestRepository.pay(paymentRecord);
      } catch (error: any) {
        console.error("Error during B1 API call", error);

        paymentRecord.sapMessage =
          error?.Description ?? "Error During B1 Create Invoice";
        paymentRecord.sapStatus = false;
        paymentRecord.retryDate = DateTime.now().toString();

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
      }
    }
  }
}
