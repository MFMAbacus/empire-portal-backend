import { IDeliverySLAMaster } from "@/schemas/delivery-sla-master-schema";
import DeliverySLAMaster from "@/schemas/delivery-sla-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  DeliverySLAMasterRepository,
  GetAllDeliverySLAMasterOptions,
} from "./delivery-sla-master-repository";

export class DeliverySLAMasterRepositoryDb
  extends MongoRepository<IDeliverySLAMaster>
  implements DeliverySLAMasterRepository
{
  public constructor() {
    super(DeliverySLAMaster);
  }

  public async getAll(
    options: GetAllDeliverySLAMasterOptions = {}
  ): Promise<IDeliverySLAMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IDeliverySLAMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(
    record: Partial<IDeliverySLAMaster>
  ): Promise<IDeliverySLAMaster> {
    return await super.create(record as IDeliverySLAMaster);
  }

  public async Update(
    record: Partial<IDeliverySLAMaster>
  ): Promise<IDeliverySLAMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IDeliverySLAMaster | null> {
    return await super.delete(id);
  }
}