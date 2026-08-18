import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { ITransactionRecord } from "@/records/transaction-record";

type Props = {
  transactionRepository: TransactionRepository;
};

export class GetAllTransactionsService {
  protected _transactionRepository: TransactionRepository;

  public constructor(props: Props) {
    this._transactionRepository = props.transactionRepository;
  }

  public async execute(): Promise<Result<ITransactionRecord[], Failure>> {
    try {
      const transactions = await this._transactionRepository.getAll();
      return Result.ok(transactions);
    } catch (error) {
      return Result.fail(
        Failure.make({
          code: "transaction-fetch-failed",
          data: error,
        })
      );
    }
  }
}