import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IMovementTypeMaster } from "@/schemas/movement-type-master-schema";
import { SessionRecord } from "@/records/session-record";
import { MovementTypeMasterRepository } from "@/repositories/movement-type-master-repository";

type Props = {
  movementTypeMasterRepository: MovementTypeMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetMovementTypeMasterService {
  protected _movementTypeMasterRepository: MovementTypeMasterRepository;

  public constructor(props: Props) {
    this._movementTypeMasterRepository = props.movementTypeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IMovementTypeMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._movementTypeMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
