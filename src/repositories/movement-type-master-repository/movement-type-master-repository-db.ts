import { IMovementTypeMaster } from "@/schemas/movement-type-master-schema";
import MovementTypeMaster from "@/schemas/movement-type-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  MovementTypeMasterRepository,
  GetAllMovementTypeMasterOptions,
} from "./movement-type-master-repository";

export class MovementTypeMasterRepositoryDb
  extends MongoRepository<IMovementTypeMaster>
  implements MovementTypeMasterRepository
{
  public constructor() {
    super(MovementTypeMaster);
  }

  public async getAll(options: GetAllMovementTypeMasterOptions = {}): Promise<IMovementTypeMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IMovementTypeMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IMovementTypeMaster>): Promise<IMovementTypeMaster> {
    return await super.create(record as IMovementTypeMaster);
  }

  public async Update(record: Partial<IMovementTypeMaster>): Promise<IMovementTypeMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IMovementTypeMaster | null> {
    return await super.delete(id);
  }
}
