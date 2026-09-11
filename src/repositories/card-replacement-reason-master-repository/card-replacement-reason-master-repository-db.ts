import { ICardReplacementReasonMaster } from "@/schemas/card-replacement-reason-master-schema";
import CardReplacementReasonMaster from "@/schemas/card-replacement-reason-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  CardReplacementReasonMasterRepository,
  GetAllCardReplacementReasonMasterOptions,
} from "./card-replacement-reason-master-repository";

export class CardReplacementReasonMasterRepositoryDb
  extends MongoRepository<ICardReplacementReasonMaster>
  implements CardReplacementReasonMasterRepository
{
  public constructor() {
    super(CardReplacementReasonMaster);
  }

  public async getAll(options: GetAllCardReplacementReasonMasterOptions = {}): Promise<ICardReplacementReasonMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<ICardReplacementReasonMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<ICardReplacementReasonMaster>): Promise<ICardReplacementReasonMaster> {
    return await super.create(record as ICardReplacementReasonMaster);
  }

  public async Update(record: Partial<ICardReplacementReasonMaster>): Promise<ICardReplacementReasonMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<ICardReplacementReasonMaster | null> {
    return await super.delete(id);
  }
}
