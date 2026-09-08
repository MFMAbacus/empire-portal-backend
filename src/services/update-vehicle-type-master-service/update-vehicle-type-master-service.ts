import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { VehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

type Props = {
  vehicleTypeMasterRepository: VehicleTypeMasterRepository;
};

type Input = {
  id?: string;
  vehicleTypeId?: string;
  vehicleType?: string;
  isActive?: boolean;
};

export class UpdateVehicleTypeMasterService {
  protected _vehicleTypeMasterRepository: VehicleTypeMasterRepository;

  public constructor(props: Props) {
    this._vehicleTypeMasterRepository = props.vehicleTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.vehicleTypeId || "";
    const record = await this._vehicleTypeMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    if (input.vehicleTypeId) record.vehicleTypeId = input.vehicleTypeId;
    if (input.vehicleType) record.vehicleType = input.vehicleType;
    if (typeof input.isActive !== "undefined") {
      record.isActive = Boolean(input.isActive);
    }

    await this._vehicleTypeMasterRepository.Update(record);
    return Result.ok(targetId);
  }
}