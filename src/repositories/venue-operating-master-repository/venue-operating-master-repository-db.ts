import { IVenueOperatingMaster } from "@/schemas/venue-operating-master-schema";
import VenueOperatingMaster from "@/schemas/venue-operating-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  VenueOperatingMasterRepository,
  GetAllVenueOperatingMasterOptions,
} from "./venue-operating-master-repository";

export class VenueOperatingMasterRepositoryDb
  extends MongoRepository<IVenueOperatingMaster>
  implements VenueOperatingMasterRepository
{
  public constructor() {
    super(VenueOperatingMaster);
  }

  public async getAll(options: GetAllVenueOperatingMasterOptions = {}): Promise<IVenueOperatingMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IVenueOperatingMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IVenueOperatingMaster>): Promise<IVenueOperatingMaster> {
    return await super.create(record as IVenueOperatingMaster);
  }

  public async Update(record: Partial<IVenueOperatingMaster>): Promise<IVenueOperatingMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IVenueOperatingMaster | null> {
    return await super.delete(id);
  }
}
