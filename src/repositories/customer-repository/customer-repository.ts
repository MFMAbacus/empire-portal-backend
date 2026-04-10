import { CustomerRecord, VehicleRecord } from "@/records/customer-record";
import { ICustomerRecord } from "@/schemas/customer-schema/cutomer-schema";
import { IVehicleRecord } from "@/schemas/vehicle-schema/vehicle-schema";

export abstract class CustomerRepository {
  public abstract getAll(): Promise<ICustomerRecord[]>;
  public abstract get(id: string): Promise<ICustomerRecord | undefined>;
  public abstract getByPhoneNumber(
    phoneNumber: string
  ): Promise<ICustomerRecord | undefined>;
  public abstract getByEmail(
    email: string
  ): Promise<ICustomerRecord | undefined>;
  public abstract getByUsername(
    username: string
  ): Promise<ICustomerRecord | undefined>;
  public abstract Exists(id: string): Promise<boolean>;
  public abstract existsByPhoneNumber(phoneNumber: string): Promise<boolean>;
  public abstract existsByEmail(email: string): Promise<boolean>;
  public abstract existsByUsername(username: string): Promise<boolean>;
  public abstract findByIds(ids: string[]): Promise<ICustomerRecord[]>;
  public abstract Create(record: ICustomerRecord): Promise<void>;
  public abstract Update(record: ICustomerRecord): Promise<void>;
  public abstract Delete(id: string): Promise<void>;
}
