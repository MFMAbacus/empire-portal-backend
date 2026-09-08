import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { VehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

type Props = {
  vehicleTypeMasterRepository: VehicleTypeMasterRepository;
};

type Input = {
  id?: string;
  vehicleTypeId?: string;
  isRestore?: boolean | string;
};

export class DeleteVehicleTypeMasterService {
  protected _vehicleTypeMasterRepository: VehicleTypeMasterRepository;

  public constructor(props: Props) {
    this._vehicleTypeMasterRepository = props.vehicleTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.vehicleTypeId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._vehicleTypeMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._vehicleTypeMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}