import { IGateMaster } from "@/schemas/gate-master-schema";

export type GetAllGateMasterOptions = {
  isArchived?: boolean;
};

export abstract class GateMasterRepository {
  public abstract getAll(options?: GetAllGateMasterOptions): Promise<IGateMaster[]>;
  public abstract get(id: string): Promise<IGateMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IGateMaster>): Promise<IGateMaster>;
  public abstract Update(record: Partial<IGateMaster>): Promise<IGateMaster | undefined>;
  public abstract delete(id: string): Promise<IGateMaster | null>;
}
