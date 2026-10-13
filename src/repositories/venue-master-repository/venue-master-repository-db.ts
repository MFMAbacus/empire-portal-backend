import { IVenueMaster } from "@/schemas/venue-master-schema";
import VenueMaster from "@/schemas/venue-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  VenueMasterRepository,
  GetAllVenueMasterOptions,
} from "./venue-master-repository";

export class VenueMasterRepositoryDb
  extends MongoRepository<IVenueMaster>
  implements VenueMasterRepository
{
  public constructor() {
    super(VenueMaster);
  }

  public async getAll(options: GetAllVenueMasterOptions = {}): Promise<IVenueMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IVenueMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IVenueMaster>): Promise<IVenueMaster> {
    return await super.create(record as IVenueMaster);
  }

  public async Update(record: Partial<IVenueMaster>): Promise<IVenueMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IVenueMaster | null> {
    return await super.delete(id);
  }
  public async getNextVenueId(): Promise<string> {
     const lastRecord = (await VenueMaster.findOne({
       venueId: { $regex: /^VEN-/ }
     })
       .sort({ createdAt: -1, _id: -1 })
       .lean()) as IVenueMaster | null;

     let nextNumber = 1;
     if (lastRecord && lastRecord.venueId) {
       const parts = lastRecord.venueId.split("-");
       if (parts.length === 2 && !isNaN(Number(parts[1]))) {
         nextNumber = Number(parts[1]) + 1;
       }
     }
     return `VEN-${String(nextNumber).padStart(6, "0")}`;
   }
}
