import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { VehicleRepository } from "@/repositories/vehicle-repository";
import { SessionRecord } from "@/records/session-record";
import { CustomerRepository } from "@/repositories/customer-repository";

type Props = {
  vehicleRepository: VehicleRepository;
  customerRepository: CustomerRepository;
};

type Input = {
  customerId: string;
  id: string;
  sessionRecord: SessionRecord;
};

export class DeleteVehcile {
  protected _vehicleRepository: VehicleRepository;
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._vehicleRepository = props.vehicleRepository;
    this._customerRepository = props.customerRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const customerId = Attribute.make(input.customerId);
    const idValidationRule = Validation.make(customerId.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const vehicleId = Attribute.make(input.id);
    const vehicleIdValidationRule = Validation.make(vehicleId.get())
      .mandatory()
      .string()
      .getRule();
    if (vehicleIdValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    if (!(await this._customerRepository.Exists(customerId.get()))) {
      return Result.fail(Failure.notFound());
    }

    if (!(await this._vehicleRepository.vehicleExists(vehicleId.get()))) {
      return Result.fail(Failure.notFound());
    }

    if (input.sessionRecord.role !== "manager") {
      if (input.sessionRecord.userId !== customerId.get()) {
        return Result.fail(Failure.notFound());
      }
    }

    await this._vehicleRepository.deleteVehicle(
      customerId.get(),
      vehicleId.get()
    );

    return Result.ok(undefined);
  }
}
