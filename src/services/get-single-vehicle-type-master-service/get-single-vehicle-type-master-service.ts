import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IVehicleTypeMaster } from "@/schemas/vehicle-type-master-schema";
import { VehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

type Props = {
  vehicleTypeMasterRepository: VehicleTypeMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleVehicleTypeMasterService {
  protected _vehicleTypeMasterRepository: VehicleTypeMasterRepository;

  public constructor(props: Props) {
    this._vehicleTypeMasterRepository = props.vehicleTypeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IVehicleTypeMaster, Failure>> {
    const vehicleType = await this._vehicleTypeMasterRepository.get(input.id);
    if (!vehicleType) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (vehicleType as any).toObject === "function" ? (vehicleType as any).toObject() : { ...vehicleType };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}