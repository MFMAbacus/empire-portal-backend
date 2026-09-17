import { ICourtBookingMaster } from "@/schemas/court-booking-master-schema";
import CourtBookingMaster from "@/schemas/court-booking-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CourtBookingMasterRepository,
  GetAllCourtBookingMasterOptions,
} from "./court-booking-master-repository";

export class CourtBookingMasterRepositoryDb
  extends MongoRepository<ICourtBookingMaster>
  implements CourtBookingMasterRepository
{
  public constructor() {
    super(CourtBookingMaster);
  }

  public async getAll(options: GetAllCourtBookingMasterOptions = {}): Promise<ICourtBookingMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICourtBookingMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICourtBookingMaster>): Promise<ICourtBookingMaster> {
    return await super.create(record as ICourtBookingMaster);
  }

  public async Update(record: Partial<ICourtBookingMaster>): Promise<ICourtBookingMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICourtBookingMaster | null> {
    return await super.delete(id);
  }
}
