import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { MovementRuleMasterModel } from "@/models/movement-rule-master-model";
import { MovementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

type Props = {
  movementRuleMasterRepository: MovementRuleMasterRepository;
};

type Input = {
  id?: string; // Database Primary Key (Edit mode ke liye)
  ruleId?: string; // Unique Rule Identifier
  projectCode: string;
  startTime: string;
  endTime: string;
  blockedDays?: string;
  isActive?: boolean;
};

export class CreateMovementRuleMasterService {
  protected _movementRuleMasterRepository: MovementRuleMasterRepository;

  public constructor(props: Props) {
    this._movementRuleMasterRepository =
      props.movementRuleMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive =
      typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._movementRuleMasterRepository.get(
        input.id,
      );
      if (existing) {
        existing.ruleId = input.ruleId || existing.ruleId;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.startTime = input.startTime || existing.startTime;
        existing.endTime = input.endTime || existing.endTime;
        existing.blockedDays =
          typeof input.blockedDays !== "undefined"
            ? input.blockedDays
            : existing.blockedDays;
        existing.isActive = isActive;

        await this._movementRuleMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'MR' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("MR");

    const movementRuleModel = MovementRuleMasterModel.make({
      id: primaryKeyId,
      ruleId: primaryKeyId, // Standard unique code backend pe generate ho jayega
      projectCode: input.projectCode,
      startTime: input.startTime,
      endTime: input.endTime,
      blockedDays: input.blockedDays || "",
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = movementRuleModel.validate();
    if (validationBag.hasErrors()) {
      console.log("Validation Bag Errors:", validationBag.hasErrors);
      return Result.fail(Failure.validation(validationBag));
    }

    const record = movementRuleModel.getRecord();
    await this._movementRuleMasterRepository.Create(record as any);

    return Result.ok(movementRuleModel.get("id"));
  }
}