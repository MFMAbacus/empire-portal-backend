import { TransactionRepositoryDb } from "./transaction-repository-db";

export const transactionRepository: TransactionRepositoryDb =
  new TransactionRepositoryDb();

export * from "./transaction-repository-db";
export * from "./transaction-repository";
