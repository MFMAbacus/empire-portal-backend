import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CourtBlockingMasterModel } from "@/models/court-blocking-master-model";
import { CourtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

type Props = {
  courtBlockingMasterRepository: CourtBlockingMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "1")
  blockId: string;     // User Input Code (e.g., "APT-101")
  blockDate: string;
  courtId: string;
  startTime: string;
  endTime: string;
  reason: string;
  createdBy: string;
  isActive?: boolean;
};

export class UpdateCourtBlockingMasterService {
  protected _courtBlockingMasterRepository: CourtBlockingMasterRepository;

  public constructor(props: Props) {
    this._courtBlockingMasterRepository = props.courtBlockingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input blockId
    const targetId = input.id || input.blockId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._courtBlockingMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const courtBlockingModel = CourtBlockingMasterModel.make({
      id: targetId,
      blockId: input.blockId || record.blockId,
      blockDate: input.blockDate || record.blockDate,
      startTime: input.startTime || record.startTime,
      endTime: input.endTime || record.endTime,
      courtId: input.courtId || record.courtId,
      reason: input.reason || record.reason,
      createdBy: input.createdBy || record.createdBy,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = courtBlockingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = courtBlockingModel.getRecord();
    await this._courtBlockingMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}