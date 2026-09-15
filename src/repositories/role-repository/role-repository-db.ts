import { IUserRole } from "@/schemas/role-schema";
import UserRole from "@/schemas/role-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  UserRoleRepository,
  GetAllUserRoleOptions,
} from "./role-repository";

export class UserRoleRepositoryDb
  extends MongoRepository<IUserRole>
  implements UserRoleRepository
{
  public constructor() {
    super(UserRole);
  }

  public async getAll(options: GetAllUserRoleOptions = {}): Promise<IUserRole[]> {
    
    return super.getAll(options);
  }

  public async get(id: string): Promise<IUserRole | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IUserRole>): Promise<IUserRole> {
    return await super.create(record as IUserRole);
  }

  public async Update(record: Partial<IUserRole>): Promise<IUserRole | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IUserRole | null> {
    return await super.delete(id);
  }
}
