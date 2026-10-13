import { IApartmentMaster } from "@/schemas/apartment-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ApartmentMasterRepository,
  GetAllApartmentMasterOptions,
} from "./apartment-master-repository";

export class ApartmentMasterRepositoryDb
  extends MongoRepository<IApartmentMaster>
  implements ApartmentMasterRepository
{
  public constructor() {
    super(ApartmentMaster);
  }

  public async getAll(options: GetAllApartmentMasterOptions = {}): Promise<IApartmentMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IApartmentMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IApartmentMaster>): Promise<IApartmentMaster> {
    return await super.create(record as IApartmentMaster);
  }

  public async Update(record: Partial<IApartmentMaster>): Promise<IApartmentMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IApartmentMaster | null> {
    return await super.delete(id);
  }
  
  public async getNextApartmentId(): Promise<string> {
    const lastRecord = await ApartmentMaster.findOne({
      apartmentId: { $regex: /^APT-/ }
    })
      .sort({ createdAt: -1, _id: -1 })
      .lean();
    let nextNumber = 1;
    if (lastRecord && lastRecord.apartmentId) {
      const parts = lastRecord.apartmentId.split("-");
      if (parts.length === 2 && !isNaN(Number(parts[1]))) {
        nextNumber = Number(parts[1]) + 1;
      }
    }
    return `APT-${String(nextNumber).padStart(6, "0")}`;
  }
}
