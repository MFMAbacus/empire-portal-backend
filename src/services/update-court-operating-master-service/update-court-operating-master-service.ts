import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CourtOperatingMasterModel } from "@/models/court-operating-master-model";
import { CourtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

type Props = {
  courtOperatingMasterRepository: CourtOperatingMasterRepository;
};

type Input = {
  id?: string;    
  courtId?: string;
  day?: string;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
  isActive?: boolean;
};

export class UpdateCourtOperatingMasterService {
  protected _courtOperatingMasterRepository: CourtOperatingMasterRepository;

  public constructor(props: Props) {
    this._courtOperatingMasterRepository = props.courtOperatingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to courtOperatingId
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._courtOperatingMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;
    const isClosed =
      typeof input.isClosed !== "undefined"
        ? Boolean(input.isClosed)
        : record.isClosed;

    // Model me courtOperating fields map aur validate kar rahe hain (naya input ya purana fallback)
    const courtOperatingModel = CourtOperatingMasterModel.make({
      id: targetId,
      courtId: input.courtId || record.courtId,
      day: input.day || record.day,
      openTime: input.openTime || record.openTime,
      closeTime: input.closeTime || record.closeTime,
      isClosed: isClosed,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = courtOperatingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = courtOperatingModel.getRecord();
    await this._courtOperatingMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}