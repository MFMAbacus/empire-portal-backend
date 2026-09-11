import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { CardReplacementReasonMasterModel } from "@/models/card-replacement-reason-master-model";
import { CardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

type Props = {
  cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;
};

type Input = {
  id?: string;              // Database Primary Key (Edit mode me hi aayega)
  reasonId: string;   // User Input Code (e.g. "MT-01")
  reasonName: string;
  chargesApplicable: boolean;
  isActive?: boolean;
};

export class CreateCardReplacementReasonMasterService {
  protected _cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;

  public constructor(props: Props) {
    this._cardReplacementReasonMasterRepository = props.cardReplacementReasonMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const chargesApplicable = typeof input.chargesApplicable !== "undefined" ? Boolean(input.chargesApplicable) : false;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._cardReplacementReasonMasterRepository.get(input.id);
      if (existing) {
        existing.reasonId = input.reasonId || existing.reasonId;
        existing.reasonName = input.reasonName || existing.reasonName;
        existing.chargesApplicable= chargesApplicable;
        existing.isActive = isActive;

        await this._cardReplacementReasonMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'MT' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("RI");

    const cardReplacementReasonModel = CardReplacementReasonMasterModel.make({
      id: primaryKeyId,                  // Database Primary Key -> MT-12345
      reasonId: input.reasonId, // User Input -> MT-01
      reasonName : input.reasonName,
      chargesApplicable: chargesApplicable,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = cardReplacementReasonModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = cardReplacementReasonModel.getRecord();
    await this._cardReplacementReasonMasterRepository.Create(record as any);

    return Result.ok(cardReplacementReasonModel.get("id"));
  }
}