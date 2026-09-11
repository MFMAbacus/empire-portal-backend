import { IAccessCardMaster } from "@/schemas/access-card-master-schema";

export type GetAllAccessCardMasterOptions = {
  isArchived?: boolean;
};

export abstract class AccessCardMasterRepository {
  public abstract getAll(options?: GetAllAccessCardMasterOptions): Promise<IAccessCardMaster[]>;
  public abstract get(id: string): Promise<IAccessCardMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IAccessCardMaster>): Promise<IAccessCardMaster>;
  public abstract Update(record: Partial<IAccessCardMaster>): Promise<IAccessCardMaster | undefined>;
  public abstract delete(id: string): Promise<IAccessCardMaster | null>;
}
