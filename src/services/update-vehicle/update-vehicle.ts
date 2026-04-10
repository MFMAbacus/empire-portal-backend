import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { VehicleRepository } from "@/repositories/vehicle-repository";
import { SessionRecord } from "@/records/session-record";
import { VehicleModel } from "@/models/customer-model";
import { CustomerRepository } from "@/repositories/customer-repository";

type Props = {
  vehicleRepository: VehicleRepository;
  customerRepository: CustomerRepository;
};

type Input = {
  customerId: string;
  id: string;
  palletNumber?: string;
  type?: string;
  model?: string;
  color?: string;
  sessionRecord: SessionRecord;
};

export class UpdateVehcile {
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

    const customerRecord = await this._customerRepository.get(customerId.get());

    if (typeof customerRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const vehicleRecord = await this._vehicleRepository.getVehicle(
      vehicleId.get()
    );

    if (typeof vehicleRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    if (input.sessionRecord.role !== "manager") {
      if (input.sessionRecord.userId !== customerId.get()) {
        return Result.fail(Failure.notFound());
      }
    }

    const vehicleModel = VehicleModel.make(vehicleRecord);
    vehicleModel.set("palletNumber", input.palletNumber);
    vehicleModel.set("model", input.model);
    vehicleModel.set("type", input.type);
    vehicleModel.set("color", input.color);
    vehicleModel.set("id", input.id);

    const validationBag = vehicleModel.validate();

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._vehicleRepository.updateVehicle(vehicleModel.getRecord());

    return Result.ok(undefined);
  }
}
