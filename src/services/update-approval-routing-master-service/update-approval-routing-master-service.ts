import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ApprovalRoutingMasterModel } from "@/models/approval-routing-master-model";
import { ApprovalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

type Props = {
  approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;
};

type Input = {
  id?: string;             // Database record ID
  routingId: string;      // Unique routing Identifier
  module?: string;
  approverRole?: string;
  approvalLevel?: string;
  projectCode?: string;
  isActive?: boolean;
};

export class UpdateApprovalRoutingMasterService {
  protected _approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;

  public constructor(props: Props) {
    this._approvalRoutingMasterRepository = props.approvalRoutingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to routingId
    const targetId = input.id || input.routingId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._approvalRoutingMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Model me routing fields map aur validate kar rahe hain (naya input ya purana fallback)
    const approvalRoutingModel = ApprovalRoutingMasterModel.make({
      id: targetId,
      routingId: input.routingId || record.routingId,
      module: input.module || record.module,
      approverRole: input.approverRole || record.approverRole,
      approvalLevel: input.approvalLevel || record.approvalLevel,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = approvalRoutingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = approvalRoutingModel.getRecord();
    await this._approvalRoutingMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}