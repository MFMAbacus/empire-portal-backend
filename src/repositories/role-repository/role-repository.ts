import { IUserRole } from "@/schemas/role-schema";

export type GetAllUserRoleOptions = {
  isArchived?: boolean;
};

export abstract class UserRoleRepository {
  public abstract getAll(options?: GetAllUserRoleOptions): Promise<IUserRole[]>;
  public abstract get(id: string): Promise<IUserRole | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IUserRole>): Promise<IUserRole>;
  public abstract Update(record: Partial<IUserRole>): Promise<IUserRole | undefined>;
  public abstract delete(id: string): Promise<IUserRole | null>;
}