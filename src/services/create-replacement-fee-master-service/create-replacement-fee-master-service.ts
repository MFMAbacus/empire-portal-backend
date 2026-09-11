import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ReplacementFeeMasterModel } from "@/models/replacement-fee-master-model";
import { ReplacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

type Props = {
  replacementFeeMasterRepository: ReplacementFeeMasterRepository;
};

type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  feeId: string;       // User Input Code (e.g. "APT-101")
  feeAmount: number;
  currency: string;
  tax: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateReplacementFeeMasterService {
  protected _replacementFeeMasterRepository: ReplacementFeeMasterRepository;

  public constructor(props: Props) {
    this._replacementFeeMasterRepository = props.replacementFeeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._replacementFeeMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.feeId = input.feeId || existing.feeId;
        existing.feeAmount = input.feeAmount || existing.feeAmount;
        existing.tax = input.tax || existing.tax;
        existing.currency = input.currency || existing.currency;
        existing.isActive = isActive;

        await this._replacementFeeMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'FI' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("FI");

    const replacementFeeModel = ReplacementFeeMasterModel.make({
      id: primaryKeyId,              // Database Primary Key -> FI-12345
      feeId: input.feeId, // User Input -> APT-101
      projectCode: input.projectCode,
      feeAmount: input.feeAmount,
      tax: input.tax,
      currency: input.currency,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = replacementFeeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = replacementFeeModel.getRecord();
    await this._replacementFeeMasterRepository.Create(record as any);

    return Result.ok(replacementFeeModel.get("id"));
  }
}