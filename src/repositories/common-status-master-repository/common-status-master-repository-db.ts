import { ICommonStatusMaster } from "@/schemas/common-status-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CommonStatusMasterRepository,
  GetAllCommonStatusMasterOptions,
} from "./common-status-master-repository";

export class CommonStatusMasterRepositoryDb
  extends MongoRepository<ICommonStatusMaster>
  implements CommonStatusMasterRepository
{
  public constructor() {
    super(CommonStatusMaster);
  }

  public async getAll(options: GetAllCommonStatusMasterOptions = {}): Promise<ICommonStatusMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICommonStatusMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICommonStatusMaster>): Promise<ICommonStatusMaster> {
    return await super.create(record as ICommonStatusMaster);
  }

  public async Update(record: Partial<ICommonStatusMaster>): Promise<ICommonStatusMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICommonStatusMaster | null> {
    return await super.delete(id);
  }
}
