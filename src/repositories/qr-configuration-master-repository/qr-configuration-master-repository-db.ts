import { IQRConfigurationMaster } from "@/schemas/qr-configuration-master-schema";
import QRConfigurationMaster from "@/schemas/qr-configuration-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  QRConfigurationMasterRepository,
  GetAllQRConfigurationMasterOptions,
} from "./qr-configuration-master-repository";

export class QRConfigurationMasterRepositoryDb
  extends MongoRepository<IQRConfigurationMaster>
  implements QRConfigurationMasterRepository
{
  public constructor() {
    super(QRConfigurationMaster);
  }

  public async getAll(options: GetAllQRConfigurationMasterOptions = {}): Promise<IQRConfigurationMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IQRConfigurationMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IQRConfigurationMaster>): Promise<IQRConfigurationMaster> {
    return await super.create(record as IQRConfigurationMaster);
  }

  public async Update(record: Partial<IQRConfigurationMaster>): Promise<IQRConfigurationMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IQRConfigurationMaster | null> {
    return await super.delete(id);
  }
}
