import { IItemTypeMaster } from "@/schemas/item-type-master-schema";
import ItemTypeMaster from "@/schemas/item-type-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ItemTypeMasterRepository,
  GetAllItemTypeMasterOptions,
} from "./item-type-master-repository";

export class ItemTypeMasterRepositoryDb
  extends MongoRepository<IItemTypeMaster>
  implements ItemTypeMasterRepository
{
  public constructor() {
    super(ItemTypeMaster);
  }

  public async getAll(options: GetAllItemTypeMasterOptions = {}): Promise<IItemTypeMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IItemTypeMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IItemTypeMaster>): Promise<IItemTypeMaster> {
    return await super.create(record as IItemTypeMaster);
  }

  public async Update(record: Partial<IItemTypeMaster>): Promise<IItemTypeMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IItemTypeMaster | null> {
    return await super.delete(id);
  }
  public async getNextItemTypeId(): Promise<string> {
    const lastRecord = await ItemTypeMaster.findOne({
      itemTypeId: { $regex: /^IT-/ }
    })
      .sort({ createdAt: -1, _id: -1 })
      .lean();
    let nextNumber = 1;
    if (lastRecord && lastRecord.itemTypeId) {
      const parts = lastRecord.itemTypeId.split("-");
      if (parts.length === 2 && !isNaN(Number(parts[1]))) {
        nextNumber = Number(parts[1]) + 1;
      }
    }
    return `IT-${String(nextNumber).padStart(6, "0")}`;
  }
}
