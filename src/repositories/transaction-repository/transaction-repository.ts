import {
  ITransactionRecord,
  TransactionStatus,
  TransactionType,
} from "@/records/transaction-record";

export abstract class TransactionRepository {
  public abstract getAll(): Promise<ITransactionRecord[]>;
  public abstract get(id: string): Promise<ITransactionRecord | undefined>;
  public abstract getByTransactionRefCode(
    transactionRefCode: string
  ): Promise<ITransactionRecord | undefined>;
  public abstract getBySapRefCode(
    sapRefCode: string
  ): Promise<ITransactionRecord | undefined>;
  public abstract getByType(
    type: TransactionType
  ): Promise<ITransactionRecord[]>;
  public abstract getByStatus(
    status: TransactionStatus
  ): Promise<ITransactionRecord[]>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract existsByTransactionRefCode(
    transactionRefCode: string
  ): Promise<boolean>;
  public abstract existsBySapRefCode(sapRefCode: string): Promise<boolean>;
  public abstract Create(record: ITransactionRecord): Promise<void>;
  public abstract Update(record: ITransactionRecord): Promise<void>;
  public abstract Delete(id: string): Promise<void>;
  public abstract updateStatus(
    id: string,
    status: TransactionStatus
  ): Promise<void>;
}
