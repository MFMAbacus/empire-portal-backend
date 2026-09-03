import { IPropertyMaster } from "@/schemas/property-master-schema";

export type GetAllPropertyMasterOptions = {
  isArchived?: boolean;
};

export abstract class PropertyMasterRepository {
  public abstract getAll(options?: GetAllPropertyMasterOptions): Promise<IPropertyMaster[]>;
  public abstract get(id: string): Promise<IPropertyMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IPropertyMaster>): Promise<IPropertyMaster>;
  public abstract Update(record: Partial<IPropertyMaster>): Promise<IPropertyMaster | undefined>;
  public abstract delete(id: string): Promise<IPropertyMaster | null>;
}
