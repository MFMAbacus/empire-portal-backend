import { IProjectVenueMaster } from "@/schemas/project-venue-master-schema";
import ProjectVenueMaster from "@/schemas/project-venue-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ProjectVenueMasterRepository,
  GetAllProjectVenueMasterOptions,
} from "./project-venue-master-repository";

export class ProjectVenueMasterRepositoryDb
  extends MongoRepository<IProjectVenueMaster>
  implements ProjectVenueMasterRepository
{
  public constructor() {
    super(ProjectVenueMaster);
  }

  public async getAll(options: GetAllProjectVenueMasterOptions = {}): Promise<IProjectVenueMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IProjectVenueMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IProjectVenueMaster>): Promise<IProjectVenueMaster> {
    return await super.create(record as IProjectVenueMaster);
  }

  public async Update(record: Partial<IProjectVenueMaster>): Promise<IProjectVenueMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IProjectVenueMaster | null> {
    return await super.delete(id);
  }
}
