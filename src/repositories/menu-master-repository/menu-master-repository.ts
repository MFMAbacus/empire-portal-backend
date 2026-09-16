import { IMenuMaster } from "@/schemas/menu-master-schema";

export type GetAllMenuMasterOptions = {
  isArchived?: boolean;
};

export abstract class MenuMasterRepository {
  public abstract getAll(options?: GetAllMenuMasterOptions): Promise<IMenuMaster[]>;
  public abstract get(id: string): Promise<IMenuMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IMenuMaster>): Promise<IMenuMaster>;
  public abstract Update(record: Partial<IMenuMaster>): Promise<IMenuMaster | undefined>;
  public abstract delete(id: string): Promise<IMenuMaster | null>;
}
