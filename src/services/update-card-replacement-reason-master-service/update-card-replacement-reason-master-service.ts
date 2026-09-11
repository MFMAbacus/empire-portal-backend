import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CardReplacementReasonMasterModel } from "@/models/card-replacement-reason-master-model";
import { CardReplacementReasonMasterRepository } from "@/repositories/card-replacement-reason-master-repository";

type Props = {
  cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;
};

type Input = {
  id?: string;              // Database Primary Key ID (e.g. "IT-12345")
  reasonId: string;   // User Input Code (e.g. "IT-01")
  reasonName: string;            
  chargesApplicable: boolean;
  isActive?: boolean;
};

export class UpdateCardReplacementReasonMasterService {
  protected _cardReplacementReasonMasterRepository: CardReplacementReasonMasterRepository;

  public constructor(props: Props) {
    this._cardReplacementReasonMasterRepository = props.cardReplacementReasonMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input cardReplacementReasonId
    const targetId = input.id || input.reasonId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._cardReplacementReasonMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;
const chargesApplicable =
      typeof input.chargesApplicable !== "undefined"
        ? Boolean(input.chargesApplicable)
        : record.chargesApplicable;

    // Re-construct & validate with Model before saving
    const cardReplacementReasonModel = CardReplacementReasonMasterModel.make({
      id: targetId,
      reasonId: input.reasonId || record.reasonId,
      reasonName: input.reasonName || record.reasonName,
      chargesApplicable: chargesApplicable,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = cardReplacementReasonModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = cardReplacementReasonModel.getRecord();
    await this._cardReplacementReasonMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}