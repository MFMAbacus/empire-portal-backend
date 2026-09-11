import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ReplacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

type Props = {
  replacementFeeMasterRepository: ReplacementFeeMasterRepository;
};

type Input = {
  id?: string;
  feeId?: string;
  isRestore?: boolean | string;
};

export class DeleteReplacementFeeMasterService {
  protected _replacementFeeMasterRepository: ReplacementFeeMasterRepository;

  public constructor(props: Props) {
    this._replacementFeeMasterRepository = props.replacementFeeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.feeId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._replacementFeeMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._replacementFeeMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
