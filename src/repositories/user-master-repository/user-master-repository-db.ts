import { IUserMaster } from "@/schemas/user-master-schema";
import UserMaster from "@/schemas/user-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  UserMasterRepository,
  GetAllUserMasterOptions,
} from "./user-master-repository";

export class UserMasterRepositoryDb
  extends MongoRepository<IUserMaster>
  implements UserMasterRepository
{
  public constructor() {
    super(UserMaster);
  }

  public async getAll(options: GetAllUserMasterOptions = {}): Promise<IUserMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IUserMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IUserMaster>): Promise<IUserMaster> {
    return await super.create(record as IUserMaster);
  }

  public async Update(record: Partial<IUserMaster>): Promise<IUserMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IUserMaster | null> {
    return await super.delete(id);
  }
}
