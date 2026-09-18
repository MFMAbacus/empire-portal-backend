import { ICommonStatusMaster } from "@/schemas/common-status-master-schema";

export type GetAllCommonStatusMasterOptions = {
  isArchived?: boolean;
};

export abstract class CommonStatusMasterRepository {
  public abstract getAll(options?: GetAllCommonStatusMasterOptions): Promise<ICommonStatusMaster[]>;
  public abstract get(id: string): Promise<ICommonStatusMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ICommonStatusMaster>): Promise<ICommonStatusMaster>;
  public abstract Update(record: Partial<ICommonStatusMaster>): Promise<ICommonStatusMaster | undefined>;
  public abstract delete(id: string): Promise<ICommonStatusMaster | null>;
}
