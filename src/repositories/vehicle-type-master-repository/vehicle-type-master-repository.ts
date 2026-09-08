import { IVehicleTypeMaster } from "@/schemas/vehicle-type-master-schema";

export type GetAllVehicleTypeMasterOptions = {
  isArchived?: boolean;
};

export abstract class VehicleTypeMasterRepository {
  public abstract getAll(options?: GetAllVehicleTypeMasterOptions): Promise<IVehicleTypeMaster[]>;
  public abstract get(id: string): Promise<IVehicleTypeMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IVehicleTypeMaster>): Promise<IVehicleTypeMaster>;
  public abstract Update(record: Partial<IVehicleTypeMaster>): Promise<IVehicleTypeMaster | undefined>;
  public abstract delete(id: string): Promise<IVehicleTypeMaster | null>;
}
