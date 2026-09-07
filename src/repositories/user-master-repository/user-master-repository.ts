import { IUserMaster } from "@/schemas/user-master-schema";

export type GetAllUserMasterOptions = {
  isArchived?: boolean;
};

export abstract class UserMasterRepository {
  public abstract getAll(options?: GetAllUserMasterOptions): Promise<IUserMaster[]>;
  public abstract get(id: string): Promise<IUserMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IUserMaster>): Promise<IUserMaster>;
  public abstract Update(record: Partial<IUserMaster>): Promise<IUserMaster | undefined>;
  public abstract delete(id: string): Promise<IUserMaster | null>;
}
