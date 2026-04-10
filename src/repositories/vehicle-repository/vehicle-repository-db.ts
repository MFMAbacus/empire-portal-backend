import { IVehicleRecord } from "@/schemas/vehicle-schema/vehicle-schema";
import { Vehicle } from "@/schemas/vehicle-schema/vehicle-schema";
import { Customer } from "@/schemas/customer-schema/cutomer-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import { CustomerRepository } from "../customer-repository";

export class VehicleRepositoryDb extends MongoRepository<IVehicleRecord> {
  protected _customerRepository;

  public constructor() {
    super(Vehicle);
    this._customerRepository = CustomerRepository;
  }

  public async Exists(id: string): Promise<boolean> {
    const data = super.exists(id);
    return data;
  }

  public async getVehicle(id: string): Promise<IVehicleRecord | undefined> {
    return this.get(id);
  }

  public async vehicleExists(id: string): Promise<boolean> {
    return this.exists(id);
  }

  public async addVehicleToCustomer(
    customerId: string,
    vehicleId: string
  ): Promise<void> {
    await Customer.updateOne(
      { id: customerId },
      { $push: { vehicles: vehicleId } }
    ).exec();
  }

  public async createVehicle(
    customerId: string,
    vehicleRecord: IVehicleRecord
  ): Promise<void> {
    const createdVehicle = await this.create(vehicleRecord);

    await Customer.updateOne(
      { id: customerId },
      { $push: { vehicles: createdVehicle._id } }
    ).exec();
  }

  public async updateVehicle(vehicleRecord: IVehicleRecord): Promise<void> {
    await this.update(vehicleRecord);
  }

  public async deleteVehicle(
    customerId: string,
    vehicleId: string
  ): Promise<IVehicleRecord | undefined> {
    const data = await this.delete(vehicleId);

    if (data) {
      const data2 = await Customer.updateOne(
        { id: customerId },
        { $pull: { vehicles: data._id } }
      ).exec();

      return data;
    } else {
      return undefined;
    }
  }
}
