import { IMovementTypeMaster } from "@/schemas/movement-type-master-schema";

export type GetAllMovementTypeMasterOptions = {
  isArchived?: boolean;
};

export abstract class MovementTypeMasterRepository {
  public abstract getAll(options?: GetAllMovementTypeMasterOptions): Promise<IMovementTypeMaster[]>;
  public abstract get(id: string): Promise<IMovementTypeMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IMovementTypeMaster>): Promise<IMovementTypeMaster>;
  public abstract Update(record: Partial<IMovementTypeMaster>): Promise<IMovementTypeMaster | undefined>;
  public abstract delete(id: string): Promise<IMovementTypeMaster | null>;
}
