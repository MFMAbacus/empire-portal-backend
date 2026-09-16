import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { CourtMasterModel } from "@/models/court-master-model";
import { CourtMasterRepository } from "@/repositories/court-master-repository";

type Props = {
  courtMasterRepository: CourtMasterRepository;
};

type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  courtId: string;       // User Input Code (e.g. "APT-101")
  courtName: string;
  courtType: string;
  location: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateCourtMasterService {
  protected _courtMasterRepository: CourtMasterRepository;

  public constructor(props: Props) {
    this._courtMasterRepository = props.courtMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._courtMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.courtId = input.courtId || existing.courtId;
        existing.courtName = input.courtName || existing.courtName;
        existing.location = input.location || existing.location;
        existing.courtType = input.courtType || existing.courtType;
        existing.isActive = isActive;

        await this._courtMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'AM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("AM");

    const courtModel = CourtMasterModel.make({
      id: primaryKeyId,              // Database Primary Key -> AM-12345
      courtId: input.courtId, // User Input -> APT-101
      projectCode: input.projectCode,
      courtName: input.courtName,
      location: input.location,
      courtType: input.courtType,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = courtModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = courtModel.getRecord();
    await this._courtMasterRepository.Create(record as any);

    return Result.ok(courtModel.get("id"));
  }
}