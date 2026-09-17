import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CourtTimeMasterModel } from "@/models/court-time-master-model";
import { CourtTimeMasterRepository } from "@/repositories/court-time-master-repository";

type Props = {
  courtTimeMasterRepository: CourtTimeMasterRepository;
};

type Input = {
  id?: string;    
  courtId?: string;
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
  isActive?: boolean;
};

export class UpdateCourtTimeMasterService {
  protected _courtTimeMasterRepository: CourtTimeMasterRepository;

  public constructor(props: Props) {
    this._courtTimeMasterRepository = props.courtTimeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to courtTimeId
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._courtTimeMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Model me courtTime fields map aur validate kar rahe hain (naya input ya purana fallback)
    const courtTimeModel = CourtTimeMasterModel.make({
      id: targetId,
      courtId: input.courtId || record.courtId,
      startTime: input.startTime || record.startTime,
      endTime: input.endTime || record.endTime,
      slotDuration: input.slotDuration || record.slotDuration,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = courtTimeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = courtTimeModel.getRecord();
    await this._courtTimeMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}