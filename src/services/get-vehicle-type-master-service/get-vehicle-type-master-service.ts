import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IVehicleTypeMaster } from "@/schemas/vehicle-type-master-schema";
import { SessionRecord } from "@/records/session-record";
import { VehicleTypeMasterRepository } from "@/repositories/vehicle-type-master-repository";

type Props = {
  vehicleTypeMasterRepository: VehicleTypeMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetVehicleTypeMasterService {
  protected _vehicleTypeMasterRepository: VehicleTypeMasterRepository;

  public constructor(props: Props) {
    this._vehicleTypeMasterRepository = props.vehicleTypeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IVehicleTypeMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const vehicleTypes = await this._vehicleTypeMasterRepository.getAll({ isArchived });

    const mappedVehicleTypes = vehicleTypes.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedVehicleTypes as any);
  }
}