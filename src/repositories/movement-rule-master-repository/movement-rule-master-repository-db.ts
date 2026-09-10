import { IMovementRuleMaster } from "@/schemas/movement-rule-master-schema";
import MovementRuleMaster from "@/schemas/movement-rule-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  MovementRuleMasterRepository,
  GetAllMovementRuleMasterOptions,
} from "./movement-rule-master-repository";

export class MovementRuleMasterRepositoryDb
  extends MongoRepository<IMovementRuleMaster>
  implements MovementRuleMasterRepository
{
  public constructor() {
    super(MovementRuleMaster);
  }

  public async getAll(options: GetAllMovementRuleMasterOptions = {}): Promise<IMovementRuleMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IMovementRuleMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IMovementRuleMaster>): Promise<IMovementRuleMaster> {
    return await super.create(record as IMovementRuleMaster);
  }

  public async Update(record: Partial<IMovementRuleMaster>): Promise<IMovementRuleMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IMovementRuleMaster | null> {
    return await super.delete(id);
  }
}
