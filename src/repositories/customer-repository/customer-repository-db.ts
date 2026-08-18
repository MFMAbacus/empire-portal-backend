import { ICustomerRecord } from "@/schemas/customer-schema/cutomer-schema";
import { IVehicleRecord } from "@/schemas/vehicle-schema/vehicle-schema";
import { Customer } from "@/schemas/customer-schema/cutomer-schema";
import { MongoRepository } from "@/utility/mongo-repository";

export class CustomerRepositoryDb extends MongoRepository<ICustomerRecord> {
  public constructor() {
    super(Customer);
  }

  public async Create(record: ICustomerRecord): Promise<void> {
    await super.create(record);
  }

  public async getAll(): Promise<ICustomerRecord[]> {
    return await super.getAll({}, ["vehicles"]);
  }

  public async get(id: string): Promise<ICustomerRecord | undefined> {
    return await super.get(id, ["vehicles"]);
  }

  public async getByEmail(email: string): Promise<ICustomerRecord | undefined> {
    const result = await this.findOneByField("email", email);
    return result ?? undefined;
  }

  public async getByUsername(
    username: string
  ): Promise<ICustomerRecord | undefined> {
    const result = await this.findOneByField("username", username);
    return result ?? undefined;
  }

  public async getByPhoneNumber(
    phoneNumber: string
  ): Promise<ICustomerRecord | undefined> {
    const result = await this.findOneByField("phoneNumber", phoneNumber);
    return result ?? undefined;
  }

  public async Exists(id: String): Promise<boolean> {
    const count = await this.exists(id);
    return count;
  }

  public async existsByPhoneNumber(phoneNumber: string): Promise<boolean> {
    const count = await this.exists("phoneNumber", phoneNumber);
    return count;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const count = await this.exists("email", email);
    return count;
  }

  public async existsByUsername(username: string): Promise<boolean> {
    const count = await this.exists("username", username);
    return count;
  }

  public async findByIds(ids: string[]): Promise<ICustomerRecord[]> {
    return await this.Find({ id: { $in: ids } });
  }

  public async Update(record: ICustomerRecord): Promise<void> {
    await super.update(record);
  }

  public async Delete(id: string): Promise<void> {
    await this.delete(id);
  }
}
