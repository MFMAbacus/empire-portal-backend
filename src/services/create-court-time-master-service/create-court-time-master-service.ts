import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { CourtTimeMasterModel } from "@/models/court-time-master-model";
import { CourtTimeMasterRepository } from "@/repositories/court-time-master-repository";

type Props = {
  courtTimeMasterRepository: CourtTimeMasterRepository;
};

type Input = {
  id?: string;  
  courtId: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive?: boolean;
};

export class CreateCourtTimeMasterService {
  protected _courtTimeMasterRepository: CourtTimeMasterRepository;

  public constructor(props: Props) {
    this._courtTimeMasterRepository = props.courtTimeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._courtTimeMasterRepository.get(input.id);
      if (existing) {
        existing.courtId = input.courtId || existing.courtId;
        existing.slotDuration = input.slotDuration || existing.slotDuration;
        existing.startTime = input.startTime || existing.startTime;
        existing.endTime = input.endTime || existing.endTime;
        existing.isActive = isActive;

        await this._courtTimeMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("CTS");


    const courtTimeModel = CourtTimeMasterModel.make({
      id: primaryKeyId,
      courtId: input.courtId,
      startTime: input.startTime,
      endTime: input.endTime,
      slotDuration: input.slotDuration,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = courtTimeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = courtTimeModel.getRecord();
    await this._courtTimeMasterRepository.Create(record as any);

    return Result.ok(courtTimeModel.get("id"));
  }
}