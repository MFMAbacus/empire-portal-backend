import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { CourtMasterRepository } from "@/repositories/court-master-repository";

type Props = {
  courtMasterRepository: CourtMasterRepository;
};

type Input = {
  id?: string;
  courtId?: string;
  isRestore?: boolean | string;
};

export class DeleteCourtMasterService {
  protected _courtMasterRepository: CourtMasterRepository;

  public constructor(props: Props) {
    this._courtMasterRepository = props.courtMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.courtId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._courtMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._courtMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
