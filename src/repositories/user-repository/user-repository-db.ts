import { User, IUserRecord } from "@/schemas/user-schema";
import { UserRepository } from "./user-repository";
import { MongoRepository } from "@/utility/mongo-repository";

export class UserRepositoryDb
  extends MongoRepository<IUserRecord>
  implements UserRepository
{
  public constructor() {
    super(User);
  }

  public async getAll(): Promise<IUserRecord[]> {
    return super.getAll();
  }

  public async get(id: string): Promise<IUserRecord | undefined> {
    return super.get(id);
  }

  public async getByEmail(email: string): Promise<IUserRecord | undefined> {
    const result = await User.findOne({ email }).exec();
    return result || undefined;
  }

  public async getByPhoneNumber(
    phoneNumber: string
  ): Promise<IUserRecord | undefined> {
    const result = await super.findOneByField("phoneNumber", phoneNumber);
    return result ?? undefined;
  }

  public async getCachier(
    serviceType: string,
    project: string
  ): Promise<IUserRecord | undefined> {
    const result = await super.FindOne({
      isCachier: true,
      isArchived: false,
      serviceType: { $in: [serviceType] },
      project: { $in: [project] },
    });
    return result;
  }

  public async Exists(id: String): Promise<boolean> {
    const count = await super.exists(id);
    return count;
  }

  public async existsByServiceTypeAndProject(
    serviceType: string[],
    project: string[],
    id: string | undefined
  ): Promise<boolean> {
    const count = await User.countDocuments({
      serviceType: { $in: serviceType },
      project: { $in: project },
      id: { $ne: id },
    });
    return count > 0;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const count = await this.exists("email", email);
    return count;
  }

  public async cachierExists(excludeId: string): Promise<boolean> {
    const result = await User.exists({
      isCachier: true,
      id: { $ne: excludeId },
    });
    return result !== null;
  }

  public async Create(record: IUserRecord): Promise<void> {
    await super.create(record);
  }

  public async Update(record: IUserRecord): Promise<void> {
    await super.update(record);
  }

  public async Delete(id: string): Promise<void> {
    await super.delete(id);
  }
}
