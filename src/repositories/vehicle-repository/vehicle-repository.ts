import { IVehicleRecord } from "@/schemas/vehicle-schema/vehicle-schema";

export abstract class VehicleRepository {
  public abstract Exists(id: string): Promise<boolean>;
  public abstract getVehicle(id: string): Promise<IVehicleRecord | undefined>;
  public abstract vehicleExists(id: string): Promise<boolean>;
  // in this change teh ceate vehicle to also update the id in customer schema
  public abstract createVehicle(
    id: string,
    record: IVehicleRecord
  ): Promise<void>;
  public abstract updateVehicle(record: IVehicleRecord): Promise<void>;
  public abstract deleteVehicle(
    id: string,
    vehicleId: string
  ): Promise<IVehicleRecord | undefined>;
}
