import { IPropertyMaster } from "@/schemas/property-master-schema";
import PropertyMaster from "@/schemas/property-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  PropertyMasterRepository,
  GetAllPropertyMasterOptions,
} from "./property-master-repository";

export class PropertyMasterRepositoryDb
  extends MongoRepository<IPropertyMaster>
  implements PropertyMasterRepository
{
  public constructor() {
    super(PropertyMaster);
  }

  public async getAll(options: GetAllPropertyMasterOptions = {}): Promise<IPropertyMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IPropertyMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IPropertyMaster>): Promise<IPropertyMaster> {
    return await super.create(record as IPropertyMaster);
  }

  public async Update(record: Partial<IPropertyMaster>): Promise<IPropertyMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IPropertyMaster | null> {
    return await super.delete(id);
  }
}
