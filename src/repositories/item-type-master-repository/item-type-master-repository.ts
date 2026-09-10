import { IItemTypeMaster } from "@/schemas/item-type-master-schema";

export type GetAllItemTypeMasterOptions = {
  isArchived?: boolean;
};

export abstract class ItemTypeMasterRepository {
  public abstract getAll(options?: GetAllItemTypeMasterOptions): Promise<IItemTypeMaster[]>;
  public abstract get(id: string): Promise<IItemTypeMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IItemTypeMaster>): Promise<IItemTypeMaster>;
  public abstract Update(record: Partial<IItemTypeMaster>): Promise<IItemTypeMaster | undefined>;
  public abstract delete(id: string): Promise<IItemTypeMaster | null>;
}
