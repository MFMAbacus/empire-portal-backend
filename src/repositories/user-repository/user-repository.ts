import { IUserRecord } from "@/schemas/user-schema";

export abstract class UserRepository {
  public abstract getAll(): Promise<IUserRecord[]>;
  public abstract get(id: string): Promise<IUserRecord | undefined>;
  public abstract getByEmail(email: string): Promise<IUserRecord | undefined>;
  // eslint-disable-next-line max-len
  public abstract getByPhoneNumber(
    phoneNumber: string
  ): Promise<IUserRecord | undefined>;
  public abstract getCachier(
    serviceType: string,
    project: string
  ): Promise<IUserRecord | undefined>;
  public abstract Exists(id: string): Promise<boolean>;
  public abstract existsByEmail(email: string): Promise<boolean>;
  public abstract existsByServiceTypeAndProject(
    serviceType: string[],
    project: string[],
    id: string | undefined
  ): Promise<boolean>;
  public abstract cachierExists(excludeId: string): Promise<boolean>;
  public abstract Create(record: IUserRecord): Promise<void>;
  public abstract Update(record: IUserRecord): Promise<void>;
  public abstract Delete(id: string): Promise<void>;
}
