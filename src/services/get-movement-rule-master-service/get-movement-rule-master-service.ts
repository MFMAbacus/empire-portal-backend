import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IMovementRuleMaster } from "@/schemas/movement-rule-master-schema";
import { SessionRecord } from "@/records/session-record";
import { MovementRuleMasterRepository } from "@/repositories/movement-rule-master-repository";

type Props = {
  movementRuleMasterRepository: MovementRuleMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetMovementRuleMasterService {
  protected _movementRuleMasterRepository: MovementRuleMasterRepository;

  public constructor(props: Props) {
    this._movementRuleMasterRepository = props.movementRuleMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IMovementRuleMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._movementRuleMasterRepository.getAll({ isArchived });

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
