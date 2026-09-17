import { ICourtBlockingMaster } from "@/schemas/court-blocking-master-schema";
import CourtBlockingMaster from "@/schemas/court-blocking-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CourtBlockingMasterRepository,
  GetAllCourtBlockingMasterOptions,
} from "./court-blocking-master-repository";

export class CourtBlockingMasterRepositoryDb
  extends MongoRepository<ICourtBlockingMaster>
  implements CourtBlockingMasterRepository
{
  public constructor() {
    super(CourtBlockingMaster);
  }

  public async getAll(options: GetAllCourtBlockingMasterOptions = {}): Promise<ICourtBlockingMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICourtBlockingMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICourtBlockingMaster>): Promise<ICourtBlockingMaster> {
    return await super.create(record as ICourtBlockingMaster);
  }

  public async Update(record: Partial<ICourtBlockingMaster>): Promise<ICourtBlockingMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICourtBlockingMaster | null> {
    return await super.delete(id);
  }
}
