import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { GuardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

type Props = {
  guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;
};

type Input = {
  id?: string;
  guardAccountId?: string;
  isRestore?: boolean | string;
};

export class DeleteGuardAccountMappingMasterService {
  protected _guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;

  public constructor(props: Props) {
    this._guardAccountMappingMasterRepository = props.guardAccountMappingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.guardAccountId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._guardAccountMappingMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._guardAccountMappingMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
