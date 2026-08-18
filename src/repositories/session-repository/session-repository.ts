import { ISessionRecord } from "@/schemas/session-schema";

export abstract class SessionRepository {
  public abstract get(id: string): Promise<ISessionRecord | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<ISessionRecord>): Promise<void>;
  public abstract Delete(id: string): Promise<void>;
}
