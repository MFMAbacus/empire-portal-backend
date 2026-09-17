import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { CourtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

type Props = {
  courtBlockingMasterRepository: CourtBlockingMasterRepository;
};

type Input = {
  id?: string;
  blockId?: string;
  isRestore?: boolean | string;
};

export class DeleteCourtBlockingMasterService {
  protected _courtBlockingMasterRepository: CourtBlockingMasterRepository;

  public constructor(props: Props) {
    this._courtBlockingMasterRepository = props.courtBlockingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.blockId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._courtBlockingMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._courtBlockingMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
