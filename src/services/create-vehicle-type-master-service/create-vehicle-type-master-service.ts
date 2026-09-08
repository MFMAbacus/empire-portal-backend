import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { VehicleTypeMasterModel } from "@/models/vehicle-type-master-model";
import { VehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

type Props = {
  vehicleTypeMasterRepository: VehicleTypeMasterRepository;
};

type Input = {
  id?: string;
  vehicleTypeId?: string;
  vehicleType: string;
  isActive?: boolean;
};

export class CreateVehicleTypeMasterService {
  protected _vehicleTypeMasterRepository: VehicleTypeMasterRepository;

  public constructor(props: Props) {
    this._vehicleTypeMasterRepository = props.vehicleTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const targetId = input.id;
    const vehicleTypeId = input.vehicleTypeId || targetId;

    if (targetId) {
      const existing = await this._vehicleTypeMasterRepository.get(targetId);
      if (existing) {
        existing.vehicleTypeId = input.vehicleTypeId || existing.vehicleTypeId;
        existing.vehicleType = input.vehicleType || existing.vehicleType;
        existing.isActive = isActive;
        await this._vehicleTypeMasterRepository.Update(existing);
        return Result.ok(targetId);
      }
    }

    const vehicleTypeModel = VehicleTypeMasterModel.make({
      id: targetId || Generator.id("VTM"),
      vehicleTypeId: vehicleTypeId,
      vehicleType: input.vehicleType,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = vehicleTypeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = vehicleTypeModel.getRecord();
    await this._vehicleTypeMasterRepository.Create(record as any);

    return Result.ok(vehicleTypeModel.get("id"));
  }
}