import {
  Payment,
  IPaymentRecord,
  IPaymentItemRecord,
  PaymentItem,
} from "@/schemas/payment-schema";
import { PaymentRepository } from "./payment-repository";
import { MongoRepository } from "@/utility/mongo-repository";
import mongoose from "mongoose";

export class PaymentRepositoryDb
  extends MongoRepository<IPaymentRecord>
  implements PaymentRepository
{
  public constructor() {
    super(Payment);
  }

  public async getAll(): Promise<IPaymentRecord[]> {
    return await super.getAll({}, ["items"]);
  }

  public async get(id: string): Promise<IPaymentRecord | undefined> {
    return super.get(id, ["items"]);
  }

  public async getByUuid(id: string): Promise<IPaymentRecord | undefined> {
    const result = await Payment.findOne({ uuid: id }).populate("items").exec();

    return result || undefined;
  }

  public async Create(
    record: IPaymentRecord,
    itemRecord?: IPaymentItemRecord[],
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

  public async Update(record: IPaymentRecord): Promise<void> {
    await super.update(record);
  }
}
