import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { CourtBlockingMasterModel } from "@/models/court-blocking-master-model";
import { CourtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

type Props = {
  courtBlockingMasterRepository: CourtBlockingMasterRepository;
};

type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  blockId: string;       // User Input Code (e.g. "APT-101")
  blockDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  createdBy: string;
  courtId: string;
  isActive?: boolean;
};

export class CreateCourtBlockingMasterService {
  protected _courtBlockingMasterRepository: CourtBlockingMasterRepository;

  public constructor(props: Props) {
    this._courtBlockingMasterRepository = props.courtBlockingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._courtBlockingMasterRepository.get(input.id);
      if (existing) {
        existing.courtId = input.courtId || existing.courtId;
        existing.blockId = input.blockId || existing.blockId;
        existing.blockDate = input.blockDate || existing.blockDate;
        existing.startTime = input.startTime || existing.startTime;
        existing.endTime = input.endTime || existing.endTime;
        existing.reason = input.reason || existing.reason;
        existing.createdBy = input.createdBy || existing.createdBy;
        existing.isActive = isActive;

        await this._courtBlockingMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'AM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("CB");

    const courtBlockingModel = CourtBlockingMasterModel.make({
      id: primaryKeyId,              // Database Primary Key -> AM-12345
      blockId: input.blockId, // User Input -> APT-101
      courtId: input.courtId,
      blockDate: input.blockDate,
      startTime: input.startTime,
      endTime: input.endTime,
      reason: input.reason,
      createdBy: input.createdBy,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = courtBlockingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = courtBlockingModel.getRecord();
    await this._courtBlockingMasterRepository.Create(record as any);

    return Result.ok(courtBlockingModel.get("id"));
  }
}