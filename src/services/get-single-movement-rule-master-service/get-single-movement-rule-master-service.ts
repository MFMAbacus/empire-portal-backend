import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IMovementRuleMaster } from "@/schemas/movement-rule-master-schema";
import { MovementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

type Props = {
  movementRuleMasterRepository: MovementRuleMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleMovementRuleMasterService {
  protected _movementRuleMasterRepository: MovementRuleMasterRepository;

  public constructor(props: Props) {
    this._movementRuleMasterRepository = props.movementRuleMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IMovementRuleMaster, Failure>> {
    const property = await this._movementRuleMasterRepository.get(input.id);
    if (!property) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (property as any).toObject === "function" ? (property as any).toObject() : { ...property };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}
