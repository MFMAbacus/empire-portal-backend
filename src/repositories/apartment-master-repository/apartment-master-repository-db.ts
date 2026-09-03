import { IApartmentMaster } from "@/schemas/apartment-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ApartmentMasterRepository,
  GetAllApartmentMasterOptions,
} from "./apartment-master-repository";

export class ApartmentMasterRepositoryDb
  extends MongoRepository<IApartmentMaster>
  implements ApartmentMasterRepository
{
  public constructor() {
    super(ApartmentMaster);
  }

  public async getAll(options: GetAllApartmentMasterOptions = {}): Promise<IApartmentMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IApartmentMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IApartmentMaster>): Promise<IApartmentMaster> {
    return await super.create(record as IApartmentMaster);
  }

  public async Update(record: Partial<IApartmentMaster>): Promise<IApartmentMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IApartmentMaster | null> {
    return await super.delete(id);
  }
}
