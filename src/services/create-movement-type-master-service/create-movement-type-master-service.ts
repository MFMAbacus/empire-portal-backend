import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { MovementTypeMasterModel } from "@/models/movement-type-master-model";
import { MovementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

type Props = {
  movementTypeMasterRepository: MovementTypeMasterRepository;
};

type Input = {
  id?: string;              // Database Primary Key (Edit mode me hi aayega)
  movementTypeId: string;   // User Input Code (e.g. "MT-01")
  type: string;             // Move-In / Move-Out
  isActive?: boolean;
};

export class CreateMovementTypeMasterService {
  protected _movementTypeMasterRepository: MovementTypeMasterRepository;

  public constructor(props: Props) {
    this._movementTypeMasterRepository = props.movementTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._movementTypeMasterRepository.get(input.id);
      if (existing) {
        existing.movementTypeId = input.movementTypeId || existing.movementTypeId;
        existing.type = input.type || existing.type;
        existing.isActive = isActive;

        await this._movementTypeMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'MT' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("MT");

    const movementTypeModel = MovementTypeMasterModel.make({
      id: primaryKeyId,                  // Database Primary Key -> MT-12345
      movementTypeId: input.movementTypeId, // User Input -> MT-01
      type: input.type,                  // Move-In / Move-Out
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = movementTypeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = movementTypeModel.getRecord();
    await this._movementTypeMasterRepository.Create(record as any);

    return Result.ok(movementTypeModel.get("id"));
  }
}