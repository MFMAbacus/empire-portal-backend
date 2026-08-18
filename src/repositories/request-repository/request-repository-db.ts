import mongoose, { Document, Model } from "mongoose";
import {
  IRequestRecord,
  Request,
  IRequestPaymentRecord,
  IRequestItemRecord,
  IRequestUpdate,
  RequestUpdate,
  RequestPayment,
  RequestItem,
} from "@/schemas/request-schema";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";
import { GetAllOptions, RequestRepository } from "./request-repository";
import { MongoRepository } from "@/utility/mongo-repository";
import { IPaymentRecord } from "@/schemas/payment-schema";

export class RequestRepositoryDb extends MongoRepository<IRequestRecord> {
  public constructor() {
    super(Request);
  }

  public async getAll(options: GetAllOptions = {}): Promise<IRequestRecord[]> {
    const filter: any = {};
    if (options.ids && Array.isArray(options.ids)) {
      filter.id = { $in: options.ids };
    }

    return await super.getAll(filter, ["items", "payments", "updates"]);
  }

  public async get(id: string): Promise<IRequestRecord | undefined> {
    return super.get(id, ["items", "payments", "updates"]);
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this._model.countDocuments({ id }).exec();
    return count > 0;
  }

  public async itemExist(_id: string): Promise<IRequestItemRecord | null> {
    const result = await RequestItem.findById({ _id }).exec();
    return result;
  }

  public async Create(record: IRequestRecord): Promise<void> {
    const createdUpdates = await RequestUpdate.create(record.updates);
    record.updates = createdUpdates;

    await super.create(record);
  }

  public async Update(
    record: IRequestRecord,
    updateData?:
      | IRequestPaymentRecord
      | IRequestItemRecord
      | IRequestItemRecord[]
      | IRequestUpdate,
    _model?: mongoose.Model<any>,
    name?: "items" | "payments" | "updates",
  ): Promise<void> {
    if (_model && name) {
      if (Array.isArray(updateData)) {
        const createdDataArray = await Promise.all(
          updateData.map(async (item) => {
            const createdData = await _model.create(item);
            return createdData;
          }),
        );
        createdDataArray.forEach((createdData) => {
          record[name].push(createdData._id);
        });
      } else if (updateData) {
        const addData: any = await _model.create(updateData);

        record[name].push(addData._id);
      }
    }

    await super.update(record);
  }

  public async pay(paymentRecord: IPaymentRecord): Promise<void> {
    for (const item of paymentRecord.items) {
      const payment = await RequestPayment.create({
        id: Generator.shortToken(),
        method: paymentRecord.method,
        amount: item.totalAmount,
        date: DateTime.now().toString(),
      });

      const update = await RequestUpdate.create({
        id: Generator.shortToken(),
        userId: paymentRecord.customerId,
        userName: paymentRecord.customerName,
        type: "payment",
        date: DateTime.now().toString(),
      });

      const record = await Request.findOneAndUpdate(
        { id: item.requestId },
        {
          $inc: { totalPayments: item.totalAmount },
          $push: {
            payments: payment._id,
            updates: update._id,
          },
          paymentStatus: "Paid",
          postedToSap: true,
        },
        { new: true },
      );

      // if (item.categoryName === "Electricity") {
      //   const record = await Request.findOneAndUpdate(
      //     { id: item.requestId },
      //     {
      //       status: "completed",
      //       completedAt: DateTime.now().toString(),
      //     },
      //     { new: true },
      //   );

      //   const updateData = new RequestUpdate({
      //     id: Generator.shortToken(),
      //     userId: paymentRecord.customerId,
      //     userName: `${paymentRecord.customerName}`,
      //     type: "completed",
      //     date: DateTime.now().toString(),
      //   });
      // }
    }
  }

  public async Delete(id: string): Promise<void> {
    await this.delete(id);
  }

  public async deleteItem(id: string): Promise<void> {
    await RequestItem.findByIdAndDelete(id);
  }
}
