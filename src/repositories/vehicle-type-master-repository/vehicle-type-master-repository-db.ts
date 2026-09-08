import { IVehicleTypeMaster } from "@/schemas/vehicle-type-master-schema";
import VehicleTypeMaster from "@/schemas/vehicle-type-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  VehicleTypeMasterRepository,
  GetAllVehicleTypeMasterOptions,
} from "./vehicle-type-master-repository";

export class VehicleTypeMasterRepositoryDb
  extends MongoRepository<IVehicleTypeMaster>
  implements VehicleTypeMasterRepository
{
  public constructor() {
    super(VehicleTypeMaster);
  }

  public async getAll(options: GetAllVehicleTypeMasterOptions = {}): Promise<IVehicleTypeMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IVehicleTypeMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IVehicleTypeMaster>): Promise<IVehicleTypeMaster> {
    return await super.create(record as IVehicleTypeMaster);
  }

  public async Update(record: Partial<IVehicleTypeMaster>): Promise<IVehicleTypeMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IVehicleTypeMaster | null> {
    return await super.delete(id);
  }
}