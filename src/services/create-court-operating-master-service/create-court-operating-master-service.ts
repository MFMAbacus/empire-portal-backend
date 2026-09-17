import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { CourtOperatingMasterModel } from "@/models/court-operating-master-model";
import { CourtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

type Props = {
  courtOperatingMasterRepository: CourtOperatingMasterRepository;
};

type Input = {
  id?: string;  
  courtId: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
  isActive?: boolean;
};

export class CreateCourtOperatingMasterService {
  protected _courtOperatingMasterRepository: CourtOperatingMasterRepository;

  public constructor(props: Props) {
    this._courtOperatingMasterRepository = props.courtOperatingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const isClosed = typeof input.isClosed !== "undefined" ? Boolean(input.isClosed) : true;
    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._courtOperatingMasterRepository.get(input.id);
      if (existing) {
        existing.courtId = input.courtId || existing.courtId;
        existing.day = input.day || existing.day;
        existing.openTime = input.openTime || existing.openTime;
        existing.closeTime = input.closeTime || existing.closeTime;
        existing.isActive = isActive;
        existing.isClosed = isClosed;

        await this._courtOperatingMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("COH");


    const courtOperatingModel = CourtOperatingMasterModel.make({
      id: primaryKeyId,
      courtId: input.courtId,
      day: input.day,
      openTime: input.openTime,
      closeTime: input.closeTime,
      isClosed: isClosed,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = courtOperatingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = courtOperatingModel.getRecord();
    await this._courtOperatingMasterRepository.Create(record as any);

    return Result.ok(courtOperatingModel.get("id"));
  }
}