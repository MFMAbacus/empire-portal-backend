import { TransactionService } from './transaction-service';
import { TransactionRepositoryDb } from '@/repositories/transaction-repository';

const transactionRepository = new TransactionRepositoryDb();

export const transactionService = new TransactionService({
  transactionRepository,
});

// Legacy export for backward compatibility
export const paymentTransactionService = transactionService;