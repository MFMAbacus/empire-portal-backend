import { IAccessCardMaster } from "@/schemas/access-card-master-schema";
import AccessCardMaster from "@/schemas/access-card-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  AccessCardMasterRepository,
  GetAllAccessCardMasterOptions,
} from "./access-card-master-repository";

export class AccessCardMasterRepositoryDb
  extends MongoRepository<IAccessCardMaster>
  implements AccessCardMasterRepository
{
  public constructor() {
    super(AccessCardMaster);
  }

  public async getAll(options: GetAllAccessCardMasterOptions = {}): Promise<IAccessCardMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IAccessCardMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IAccessCardMaster>): Promise<IAccessCardMaster> {
    return await super.create(record as IAccessCardMaster);
  }

  public async Update(record: Partial<IAccessCardMaster>): Promise<IAccessCardMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IAccessCardMaster | null> {
    return await super.delete(id);
  }
}
