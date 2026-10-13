import VehicleTypeMaster, { IVehicleTypeMaster } from "@/schemas/vehicle-type-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  VehicleTypeMasterRepository,
  GetAllVehicleTypeMasterOptions,
} from "./vehicle-type-master-repository";
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";

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
  public async getNextVehicleTypeId(): Promise<string> {
      const lastRecord = await VehicleTypeMaster.findOne({
        vehicleTypeId: { $regex: /^VT-/ }
      })
        .sort({ createdAt: -1, _id: -1 })
        .lean();
      let nextNumber = 1;
      if (lastRecord && lastRecord.vehicleTypeId) {
        const parts = lastRecord.vehicleTypeId.split("-");
        if (parts.length === 2 && !isNaN(Number(parts[1]))) {
          nextNumber = Number(parts[1]) + 1;
        }
      }
      return `VT-${String(nextNumber).padStart(6, "0")}`;
    } 
} 