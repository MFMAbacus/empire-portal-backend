import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ReplacementFeeMasterModel } from "@/models/replacement-fee-master-model";
import { ReplacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

type Props = {
  replacementFeeMasterRepository: ReplacementFeeMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "1")
  feeId: string;     // User Input Code (e.g., "APT-101")
  feeAmount: number;
  currency: string;
  tax: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateReplacementFeeMasterService {
  protected _replacementFeeMasterRepository: ReplacementFeeMasterRepository;

  public constructor(props: Props) {
    this._replacementFeeMasterRepository = props.replacementFeeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input feeId
    const targetId = input.id || input.feeId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._replacementFeeMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const replacementFeeModel = ReplacementFeeMasterModel.make({
      id: targetId,
      feeId: input.feeId || record.feeId,
      feeAmount: input.feeAmount || record.feeAmount,
      currency: input.currency || record.currency,
      tax: input.tax || record.tax,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = replacementFeeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = replacementFeeModel.getRecord();
    await this._replacementFeeMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}