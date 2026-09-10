import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { MovementTypeMasterModel } from "@/models/movement-type-master-model";
import { MovementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

type Props = {
  movementTypeMasterRepository: MovementTypeMasterRepository;
};

type Input = {
  id?: string;              // Database Primary Key ID (e.g. "MT-12345")
  movementTypeId: string;   // User Input Code (e.g. "MT-01")
  type: string;             // Move-In / Move-Out
  isActive?: boolean;
};

export class UpdateMovementTypeMasterService {
  protected _movementTypeMasterRepository: MovementTypeMasterRepository;

  public constructor(props: Props) {
    this._movementTypeMasterRepository = props.movementTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input movementTypeId
    const targetId = input.id || input.movementTypeId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._movementTypeMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const movementTypeModel = MovementTypeMasterModel.make({
      id: targetId,
      movementTypeId: input.movementTypeId || record.movementTypeId,
      type: input.type || record.type,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = movementTypeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = movementTypeModel.getRecord();
    await this._movementTypeMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}