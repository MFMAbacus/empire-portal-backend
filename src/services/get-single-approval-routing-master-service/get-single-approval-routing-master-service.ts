import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IApprovalRoutingMaster } from "@/schemas/approval-routing-master-schema";
import { ApprovalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

type Props = {
  approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleApprovalRoutingMasterService {
  protected _approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;

  public constructor(props: Props) {
    this._approvalRoutingMasterRepository = props.approvalRoutingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IApprovalRoutingMaster, Failure>> {
    const property = await this._approvalRoutingMasterRepository.get(input.id);
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
