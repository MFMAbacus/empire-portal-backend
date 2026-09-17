import { ICourtTimeMaster } from "@/schemas/court-time-master-schema";
import CourtTimeMaster from "@/schemas/court-time-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CourtTimeMasterRepository,
  GetAllCourtTimeMasterOptions,
} from "./court-time-master-repository";

export class CourtTimeMasterRepositoryDb
  extends MongoRepository<ICourtTimeMaster>
  implements CourtTimeMasterRepository
{
  public constructor() {
    super(CourtTimeMaster);
  }

  public async getAll(options: GetAllCourtTimeMasterOptions = {}): Promise<ICourtTimeMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICourtTimeMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICourtTimeMaster>): Promise<ICourtTimeMaster> {
    return await super.create(record as ICourtTimeMaster);
  }

  public async Update(record: Partial<ICourtTimeMaster>): Promise<ICourtTimeMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICourtTimeMaster | null> {
    return await super.delete(id);
  }
}
