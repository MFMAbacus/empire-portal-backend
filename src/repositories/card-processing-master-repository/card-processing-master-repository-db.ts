import mongoose from "mongoose";
import { ICardProcessingMaster } from "@/schemas/card-processing-master-schema";
import CardProcessingMaster from "@/schemas/card-processing-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CardProcessingMasterRepository,
  GetAllCardProcessingOptions,
} from "./card-processing-master-repository";

export class CardProcessingMasterRepositoryDb
  extends MongoRepository<ICardProcessingMaster>
  implements CardProcessingMasterRepository
{
  public constructor() {
    super(CardProcessingMaster);
  }

  public async getAll(
    options: GetAllCardProcessingOptions = {}
  ): Promise<ICardProcessingMaster[]> {
    const filter: any = {};
    if (options.isArchived !== undefined) {
      filter.isArchived = options.isArchived;
    }
    if (options.residentId) {
      filter.residentId = options.residentId;
    }
    if (options.projectCode) {
      filter.projectCode = options.projectCode;
    } else if (options.projectCodes && options.projectCodes.length > 0) {
      filter.projectCode = { $in: options.projectCodes };
    }

    const docs = await this._model.find(filter).sort({ createdAt: -1 }).exec();
    return docs;
  }

  public async get(id: string): Promise<ICardProcessingMaster | undefined> {
    if (!id) return undefined;
    const filter = this._buildFilter(id);
    const result = await this._model.findOne(filter).exec();
    return result ?? undefined;
  }

  public async exists(id: string): Promise<boolean> {
    if (!id) return false;
    const filter = this._buildFilter(id);
    const count = await this._model.countDocuments(filter).exec();
    return count > 0;
  }

  public async Create(record: ICardProcessingMaster): Promise<void> {
    await super.create(record);
  }

  public async Update(
    record: Partial<ICardProcessingMaster>
  ): Promise<ICardProcessingMaster | undefined> {
    const idCandidates = [
      (record as any)._id,
      record.id,
      (record as any).requestNo,
    ].filter(Boolean);

    if (idCandidates.length === 0) return undefined;

    const conditions: any[] = [];
    for (const cand of idCandidates) {
      const str = String(cand);
      conditions.push({ id: str });
      conditions.push({ requestNo: str });
      if (mongoose.Types.ObjectId.isValid(str) && str.length === 24) {
        conditions.push({ _id: new mongoose.Types.ObjectId(str) });
      }
    }

    const filter = { $or: conditions };

    const allowed = [
      "status",
      "replacementStatus",
      "paymentStatus",
      "isSuspended",
      "approverId",
      "rejectionReason",
      "approvalHistory",
      "assignedStaffRole",
      "active",
      "isArchived",
    ];

    const setFields: any = {};
    for (const key of allowed) {
      const value = (record as any)[key];
      if (value !== undefined && value !== null) {
        setFields[key] = value;
      }
    }

    if (Object.keys(setFields).length === 0) return undefined;

    const data = await this._model
      .findOneAndUpdate(
        filter,
        { $set: setFields },
        { new: true, runValidators: false }
      )
      .exec();

    return data ?? undefined;
  }

  public async delete(id: string): Promise<ICardProcessingMaster | null> {
    if (!id) return null;
    const filter = this._buildFilter(id);
    return await this._model.findOneAndDelete(filter).exec();
  }

  private _buildFilter(id: string): any {
    if (!id) return {};
    const conditions: any[] = [{ id }, { requestNo: id }];
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      conditions.push({ _id: new mongoose.Types.ObjectId(id) });
    }
    return { $or: conditions };
  }
}
