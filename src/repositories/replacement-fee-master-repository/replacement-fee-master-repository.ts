import { IReplacementFeeMaster } from "@/schemas/replacement-fee-master-schema";

export type GetAllReplacementFeeMasterOptions = {
  isArchived?: boolean;
};

export abstract class ReplacementFeeMasterRepository {
  public abstract getAll(options?: GetAllReplacementFeeMasterOptions): Promise<IReplacementFeeMaster[]>;
  public abstract get(id: string): Promise<IReplacementFeeMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IReplacementFeeMaster>): Promise<IReplacementFeeMaster>;
  public abstract Update(record: Partial<IReplacementFeeMaster>): Promise<IReplacementFeeMaster | undefined>;
  public abstract delete(id: string): Promise<IReplacementFeeMaster | null>;
}
