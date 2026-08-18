import { Model } from "mongoose";
import {
  IInvoicePaymentRecord,
  InvoicePayment,
} from "@/schemas/invoice-payment-schema/invoice-payment-schema";
import { InvoicePaymentRepository } from "./invoice-payment-repository";
import { MongoRepository } from "@/utility/mongo-repository";
import { IInvoicePaymentItemRecord } from "@/schemas/invoice-payment-schema";
import mongoose from "mongoose";

export class InvoicePaymentRepositoryDb
  extends MongoRepository<IInvoicePaymentRecord>
  implements InvoicePaymentRepository
{
  public constructor() {
    super(InvoicePayment);
  }

  public async getAll(): Promise<IInvoicePaymentRecord[]> {
    return super.getAll({}, ["items"]);
  }

  public async get(id: string): Promise<IInvoicePaymentRecord | undefined> {
    const result = await this._model.findOne({ id }).exec();
    return result || undefined;
  }

  public async getByUuid(
    id: string
  ): Promise<IInvoicePaymentRecord | undefined> {
    const result = await super.FindOne({ uuid: id }, ["items"]);
    return result || undefined;
  }

  public async Create(
    record: IInvoicePaymentRecord,
    itemRecord?: IInvoicePaymentItemRecord[],
    _model?: mongoose.Model<any>,
    name?: "items"
  ): Promise<void> {
    if (_model && name && itemRecord) {
      const createdItems = await Promise.all(
        itemRecord.map(async (item) => {
          const createdItem = await _model.create(item);
          return createdItem;
        })
      );
      createdItems.forEach((item) => {
        record[name].push(item._id);
      });
    }

    await super.create(record);
  }

  public async Update(record: IInvoicePaymentRecord): Promise<void> {
    await super.update(record);
    // await this._model.updateOne({ id: record.id }, record).exec();
  }
}
