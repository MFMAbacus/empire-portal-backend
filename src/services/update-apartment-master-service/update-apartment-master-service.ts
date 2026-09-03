import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ApartmentMasterModel } from "@/models/aparment-master-model";
import { ApartmentMasterRepository } from "@/repositories/apartment-master-repository";

type Props = {
  apartmentMasterRepository: ApartmentMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "1")
  apartmentId: string;     // User Input Code (e.g., "APT-101")
  apartmentNo: string;
  buildingOrTower: string;
  floor: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateApartmentMasterService {
  protected _apartmentMasterRepository: ApartmentMasterRepository;

  public constructor(props: Props) {
    this._apartmentMasterRepository = props.apartmentMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input apartmentId
    const targetId = input.id || input.apartmentId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._apartmentMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const apartmentModel = ApartmentMasterModel.make({
      id: targetId,
      apartmentId: input.apartmentId || record.apartmentId,
      apartmentNo: input.apartmentNo || record.apartmentNo,
      buildingOrTower: input.buildingOrTower || record.buildingOrTower,
      floor: input.floor || record.floor,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = apartmentModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = apartmentModel.getRecord();
    await this._apartmentMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}