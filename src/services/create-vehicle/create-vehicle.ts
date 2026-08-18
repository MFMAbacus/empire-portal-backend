import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
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
  palletNumber: string;
  type: string;
  model: string;
  color: string;
  sessionRecord: SessionRecord;
};

export class CreateVehcile {
  protected _vehicleRepository: VehicleRepository;
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._vehicleRepository = props.vehicleRepository;
    this._customerRepository = props.customerRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const customerId = Attribute.make(input.customerId);
    const idValidationRule = Validation.make(customerId.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    if (!(await this._customerRepository.Exists(customerId.get()))) {
      return Result.fail(Failure.notFound());
    }

    if (input.sessionRecord.role !== "manager") {
      if (input.sessionRecord.userId !== customerId.get()) {
        return Result.fail(Failure.notFound());
      }
    }

    const vehicleModel = VehicleModel.make({
      id: Generator.id("V"),
      palletNumber: input.palletNumber,
      model: input.model,
      type: input.type,
      color: input.color,
    });

    const validationBag = vehicleModel.validate();

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._vehicleRepository.createVehicle(
      customerId.get(),
      vehicleModel.getRecord()
    );

    return Result.ok(vehicleModel.get("id"));
  }
}
