import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CourtMasterModel } from "@/models/court-master-model";
import { CourtMasterRepository } from "@/repositories/court-master-repository";

type Props = {
  courtMasterRepository: CourtMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "1")
  courtId: string;     // User Input Code (e.g., "APT-101")
  courtName: string;
  courtType: string;
  location: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateCourtMasterService {
  protected _courtMasterRepository: CourtMasterRepository;

  public constructor(props: Props) {
    this._courtMasterRepository = props.courtMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input courtId
    const targetId = input.id || input.courtId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._courtMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const courtModel = CourtMasterModel.make({
      id: targetId,
      courtId: input.courtId || record.courtId,
      courtName: input.courtName || record.courtName,
      courtType: input.courtType || record.courtType,
      location: input.location || record.location,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = courtModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = courtModel.getRecord();
    await this._courtMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}