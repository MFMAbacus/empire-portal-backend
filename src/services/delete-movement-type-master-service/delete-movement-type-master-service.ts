import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { MovementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

type Props = {
  movementTypeMasterRepository: MovementTypeMasterRepository;
};

type Input = {
  id?: string;
  movementTypeId?: string;
  isRestore?: boolean | string;
};

export class DeleteMovementTypeMasterService {
  protected _movementTypeMasterRepository: MovementTypeMasterRepository;

  public constructor(props: Props) {
    this._movementTypeMasterRepository = props.movementTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.movementTypeId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();

    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._movementTypeMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore =
      input.isRestore === true ||
      input.isRestore === "1" ||
      input.isRestore === "true";

    record.isArchived = !isRestore;
    await this._movementTypeMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}