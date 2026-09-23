import mongoose from "mongoose";
import { IGuestAccess } from "@/schemas/guest-access-schema";
import GuestAccess from "@/schemas/guest-access-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  GuestAccessRepository,
  GetAllGuestAccessOptions,
} from "./guest-access-repository";

export class GuestAccessRepositoryDb
  extends MongoRepository<IGuestAccess>
  implements GuestAccessRepository
{
  public constructor() {
    super(GuestAccess);
  }

  public async getAll(options: GetAllGuestAccessOptions = {}): Promise<IGuestAccess[]> {
    const filter: any = {};
    if (options.isArchived !== undefined) {
      filter.active = !options.isArchived;
    }
    if (options.residentId) {
      filter.residentId = options.residentId;
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IGuestAccess | undefined> {
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

  public async Create(record: IGuestAccess): Promise<void> {
    await super.create(record);
  }

  /**
   * Update by _id (ObjectId), id (custom string), or requestNo.
   * Works even if the document was created before the `id` field was added.
   */
  public async Update(
    record: Partial<IGuestAccess>
  ): Promise<IGuestAccess | undefined> {
    const searchId = (record as any)._id || record.id || (record as any).requestNo;
    if (!searchId) return undefined;

    const filter = this._buildFilter(String(searchId));

    // Only include actual schema fields — strip any extra enrichment fields
    const allowed = [
      "status", "approvalStatus", "assignedGateId", "rejectionReason",
      "approverId", "qrCode", "qrStatus", "checkInDateTime",
      "vehiclePlateNo", "vehicleType", "visitDate", "startTime",
      "duration", "comments", "active", "requestNo", "residentId",
      "apartmentId", "projectCode",
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
      .findOneAndUpdate(filter, { $set: setFields }, { new: true, runValidators: false })
      .exec();

    return data ?? undefined;
  }

  public async delete(id: string): Promise<IGuestAccess | null> {
    if (!id) return null;
    const filter = this._buildFilter(id);
    return await this._model.findOneAndDelete(filter).exec();
  }

  /**
   * Build a robust MongoDB filter:
   * - If id is a 24-char hex (valid ObjectId) → match by _id directly
   * - Otherwise → match by custom `id` field or `requestNo`
   */
  private _buildFilter(id: string): any {
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      return { _id: new mongoose.Types.ObjectId(id) };
    }
    return { $or: [{ id }, { requestNo: id }] };
  }
}
