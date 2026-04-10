import { GetAllTransactionsService } from "./get-all-transactions-service";
import { TransactionRepositoryDb } from "@/repositories/transaction-repository";

const transactionRepository = new TransactionRepositoryDb();

export const getAllTransactionsService = new GetAllTransactionsService({
  transactionRepository,
});