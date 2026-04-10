import { Model, Document } from "mongoose";
import { ISessionRecord, Session } from "@/schemas/session-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import { SessionRepository } from "./session-repository";

export class SessionRepositoryDb
  extends MongoRepository<ISessionRecord>
  implements SessionRepository
{
  public constructor() {
    super(Session);
  }

  public async get(id: string): Promise<ISessionRecord | undefined> {
    const result = await super.get(id);
    return result ?? undefined;
  }

  public async exists(id: string): Promise<boolean> {
    const result = await super.exists(id);
    return result;
  }

  public async Create(record: ISessionRecord): Promise<void> {
    await super.create(record);
  }

  public async Delete(id: string): Promise<void> {
    await super.delete(id);
  }
}
