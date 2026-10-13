import MovementTypeMaster, { IMovementTypeMaster } from "@/schemas/movement-type-master-schema";
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
  public async getNextMovementTypeId(): Promise<string> {
      const lastRecord = await MovementTypeMaster.findOne({
        movementTypeId: { $regex: /^MT-/ }
      })
        .sort({ createdAt: -1, _id: -1 })
        .lean();
      let nextNumber = 1;
      if (lastRecord && lastRecord.movementTypeId) {
        const parts = lastRecord.movementTypeId.split("-");
        if (parts.length === 2 && !isNaN(Number(parts[1]))) {
          nextNumber = Number(parts[1]) + 1;
        }
      }
      return `MT-${String(nextNumber).padStart(6, "0")}`;
    }
}
