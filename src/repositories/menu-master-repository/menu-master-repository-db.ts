import { IMenuMaster } from "@/schemas/menu-master-schema";
import MenuMaster from "@/schemas/menu-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  MenuMasterRepository,
  GetAllMenuMasterOptions,
} from "./menu-master-repository";

export class MenuMasterRepositoryDb
  extends MongoRepository<IMenuMaster>
  implements MenuMasterRepository
{
  public constructor() {
    super(MenuMaster);
  }

  public async getAll(options: GetAllMenuMasterOptions = {}): Promise<IMenuMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IMenuMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IMenuMaster>): Promise<IMenuMaster> {
    return await super.create(record as IMenuMaster);
  }

  public async Update(record: Partial<IMenuMaster>): Promise<IMenuMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IMenuMaster | null> {
    return await super.delete(id);
  }
}
