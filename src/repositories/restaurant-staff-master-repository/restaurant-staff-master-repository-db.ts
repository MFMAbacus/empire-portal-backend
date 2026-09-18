import { IRestaurantStaffMaster } from "@/schemas/restaurant-staff-master-schema";
import RestaurantStaffMaster from "@/schemas/restaurant-staff-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  RestaurantStaffMasterRepository,
  GetAllRestaurantStaffMasterOptions,
} from "./restaurant-staff-master-repository";

export class RestaurantStaffMasterRepositoryDb
  extends MongoRepository<IRestaurantStaffMaster>
  implements RestaurantStaffMasterRepository
{
  public constructor() {
    super(RestaurantStaffMaster);
  }

  public async getAll(
    options: GetAllRestaurantStaffMasterOptions = {}
  ): Promise<IRestaurantStaffMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IRestaurantStaffMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(
    record: Partial<IRestaurantStaffMaster>
  ): Promise<IRestaurantStaffMaster> {
    return await super.create(record as IRestaurantStaffMaster);
  }

  public async Update(
    record: Partial<IRestaurantStaffMaster>
  ): Promise<IRestaurantStaffMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IRestaurantStaffMaster | null> {
    return await super.delete(id);
  }
}