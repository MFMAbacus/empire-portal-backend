import { IApartmentMaster } from "@/schemas/apartment-master-schema";

export type GetAllApartmentMasterOptions = {
  isArchived?: boolean;
};

export abstract class ApartmentMasterRepository {
  public abstract getAll(options?: GetAllApartmentMasterOptions): Promise<IApartmentMaster[]>;
  public abstract get(id: string): Promise<IApartmentMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IApartmentMaster>): Promise<IApartmentMaster>;
  public abstract Update(record: Partial<IApartmentMaster>): Promise<IApartmentMaster | undefined>;
  public abstract delete(id: string): Promise<IApartmentMaster | null>;
}
