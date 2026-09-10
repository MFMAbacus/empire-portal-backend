import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IMovementTypeMaster } from "@/schemas/movement-type-master-schema";
import { MovementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

type Props = {
  movementTypeMasterRepository: MovementTypeMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleMovementTypeMasterService {
  protected _movementTypeMasterRepository: MovementTypeMasterRepository;

  public constructor(props: Props) {
    this._movementTypeMasterRepository = props.movementTypeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IMovementTypeMaster, Failure>> {
    const property = await this._movementTypeMasterRepository.get(input.id);
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
