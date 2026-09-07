import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ApprovalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

type Props = {
  approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;
};

type Input = {
  RouitngId?: string;
  isRestore?: boolean | string;
};

export class DeleteApprovalRoutingMasterService {
  protected _approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;

  public constructor(props: Props) {
    this._approvalRoutingMasterRepository = props.approvalRoutingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.RouitngId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._approvalRoutingMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._approvalRoutingMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
