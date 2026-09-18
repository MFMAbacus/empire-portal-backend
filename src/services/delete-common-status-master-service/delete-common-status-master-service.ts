import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { CommonStatusMasterRepository } from "@/repositories/common-status-master-repository";

type Props = {
  commonStatusMasterRepository: CommonStatusMasterRepository;
};

type Input = {
  id?: string;
  statusId?: string;
  isRestore?: boolean | string;
};

export class DeleteCommonStatusMasterService {
  protected _commonStatusMasterRepository: CommonStatusMasterRepository;

  public constructor(props: Props) {
    this._commonStatusMasterRepository = props.commonStatusMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.statusId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._commonStatusMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._commonStatusMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
