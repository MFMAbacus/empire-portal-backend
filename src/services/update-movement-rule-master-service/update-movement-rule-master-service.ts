import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { MovementRuleMasterModel } from "@/models/movement-rule-master-model";
import { MovementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

type Props = {
  movementRuleMasterRepository: MovementRuleMasterRepository;
};

type Input = {
  id?: string;             // Database record ID
  ruleId?: string;         // Unique rule Identifier
  projectCode?: string;
  startTime?: string;
  endTime?: string;
  blockedDays?: string;
  isActive?: boolean;
};

export class UpdateMovementRuleMasterService {
  protected _movementRuleMasterRepository: MovementRuleMasterRepository;

  public constructor(props: Props) {
    this._movementRuleMasterRepository = props.movementRuleMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to ruleId
    const targetId = input.id || input.ruleId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._movementRuleMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Model me movement rule fields map aur validate kar rahe hain (naya input ya purana fallback)
    const movementRuleModel = MovementRuleMasterModel.make({
      id: targetId,
      ruleId: input.ruleId || record.ruleId || targetId,
      projectCode: input.projectCode || record.projectCode,
      startTime: input.startTime || record.startTime,
      endTime: input.endTime || record.endTime,
      blockedDays:
        typeof input.blockedDays !== "undefined"
          ? input.blockedDays
          : record.blockedDays,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = movementRuleModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = movementRuleModel.getRecord();
    await this._movementRuleMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}