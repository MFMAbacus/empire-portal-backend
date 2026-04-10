import { Transaction, ITransaction } from "@/schemas/transaction-schema";
import {
  ITransactionRecord,
  TransactionStatus,
  TransactionType,
} from "@/records/transaction-record";
import { TransactionRepository } from "./transaction-repository";

export class TransactionRepositoryDb implements TransactionRepository {
  public async getAll(): Promise<ITransactionRecord[]> {
    const transactions = await Transaction.find().sort({ _id: -1 }).exec();
    return transactions.map(this.mapToRecord);
  }

  public async get(id: string): Promise<ITransactionRecord | undefined> {
    const transaction = await Transaction.findOne({ id }).exec();
    return transaction ? this.mapToRecord(transaction) : undefined;
  }

  public async getByTransactionRefCode(
    transactionRefCode: string
  ): Promise<ITransactionRecord | undefined> {
    const transaction = await Transaction.findOne({
      transactionRefCode,
    }).exec();
    return transaction ? this.mapToRecord(transaction) : undefined;
  }

  public async getBySapRefCode(
    sapRefCode: string
  ): Promise<ITransactionRecord | undefined> {
    const transaction = await Transaction.findOne({ sapRefCode }).exec();
    return transaction ? this.mapToRecord(transaction) : undefined;
  }

  public async getByType(type: TransactionType): Promise<ITransactionRecord[]> {
    const transactions = await Transaction.find({ type })
      .sort({ _id: -1 })
      .exec();
    return transactions.map(this.mapToRecord);
  }

  public async getByStatus(
    status: TransactionStatus
  ): Promise<ITransactionRecord[]> {
    const transactions = await Transaction.find({ status })
      .sort({ _id: -1 })
      .exec();
    return transactions.map(this.mapToRecord);
  }

  public async exists(id: string): Promise<boolean> {
    const count = await Transaction.countDocuments({ id }).exec();
    return count > 0;
  }

  public async existsByTransactionRefCode(
    transactionRefCode: string
  ): Promise<boolean> {
    const count = await Transaction.countDocuments({
      transactionRefCode,
    }).exec();
    return count > 0;
  }

  public async existsBySapRefCode(sapRefCode: string): Promise<boolean> {
    const count = await Transaction.countDocuments({ sapRefCode }).exec();
    return count > 0;
  }

  public async Create(record: ITransactionRecord): Promise<void> {
    const transaction = new Transaction(record);
    await transaction.save();
  }

  public async Update(record: ITransactionRecord): Promise<void> {
    await Transaction.findOneAndUpdate({ id: record.id }, record, {
      new: true,
    }).exec();
  }

  public async Delete(id: string): Promise<void> {
    await Transaction.findOneAndDelete({ id }).exec();
  }

  public async updateStatus(
    id: string,
    status: TransactionStatus
  ): Promise<void> {
    await Transaction.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    ).exec();
  }

  private mapToRecord(transaction: ITransaction): ITransactionRecord {
    return {
      id: transaction.id,
      type: transaction.type,
      subType: transaction.subType,
      status: transaction.status,
      amount: transaction.amount,
      transactionRefCode: transaction.transactionRefCode,
      sapRefCode: transaction.sapRefCode,
      message: transaction.message,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
