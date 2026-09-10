import { IMovementRuleMaster } from "@/schemas/movement-rule-master-schema";

export type GetAllMovementRuleMasterOptions = {
  isArchived?: boolean;
};

export abstract class MovementRuleMasterRepository {
  public abstract getAll(options?: GetAllMovementRuleMasterOptions): Promise<IMovementRuleMaster[]>;
  public abstract get(id: string): Promise<IMovementRuleMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IMovementRuleMaster>): Promise<IMovementRuleMaster>;
  public abstract Update(record: Partial<IMovementRuleMaster>): Promise<IMovementRuleMaster | undefined>;
  public abstract delete(id: string): Promise<IMovementRuleMaster | null>;
}
