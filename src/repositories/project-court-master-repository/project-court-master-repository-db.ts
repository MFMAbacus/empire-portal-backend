import { IProjectCourtMaster } from "@/schemas/project-court-master-schema";
import ProjectCourtMaster from "@/schemas/project-court-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ProjectCourtMasterRepository,
  GetAllProjectCourtMasterOptions,
} from "./project-court-master-repository";

export class ProjectCourtMasterRepositoryDb
  extends MongoRepository<IProjectCourtMaster>
  implements ProjectCourtMasterRepository
{
  public constructor() {
    super(ProjectCourtMaster);
  }

  public async getAll(options: GetAllProjectCourtMasterOptions = {}): Promise<IProjectCourtMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IProjectCourtMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IProjectCourtMaster>): Promise<IProjectCourtMaster> {
    return await super.create(record as IProjectCourtMaster);
  }

  public async Update(record: Partial<IProjectCourtMaster>): Promise<IProjectCourtMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IProjectCourtMaster | null> {
    return await super.delete(id);
  }
}
