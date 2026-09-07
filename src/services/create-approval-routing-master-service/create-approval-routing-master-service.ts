import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ApprovalRoutingMasterModel } from "@/models/approval-routing-master-model";
import { ApprovalRoutingMasterRepository } from "@/repositories/approval-routing-master-repository";

type Props = {
  approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;
};

type Input = {
  id?: string; // Database Primary Key (Edit mode me)
  routingId?: string; // Unique User Code
  module: string;
  approverRole: string;
  approvalLevel?: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateApprovalRoutingMasterService {
  protected _approvalRoutingMasterRepository: ApprovalRoutingMasterRepository;

  public constructor(props: Props) {
    this._approvalRoutingMasterRepository =
      props.approvalRoutingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive =
      typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._approvalRoutingMasterRepository.get(
        input.id,
      );
      if (existing) {
        existing.routingId = input.routingId || existing.routingId;
        existing.module = input.module || existing.module;
        existing.approverRole = input.approverRole || existing.approverRole;
        existing.approvalLevel = input.approvalLevel || existing.approvalLevel;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.isActive = isActive;

        await this._approvalRoutingMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'UM' prefix se generate hogi)
    //const primaryKeyId = input.id || Generator.id("RM");
    const primaryKeyId = input.id || Generator.id("RM");

    const approvalRoutingModel = ApprovalRoutingMasterModel.make({
      id: primaryKeyId,
      routingId: primaryKeyId, // Standard unique code backend pe generate ho jayega
      module: input.module,
      approverRole: input.approverRole,
      approvalLevel: String(input.approvalLevel || ""),
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = approvalRoutingModel.validate();
    if (validationBag.hasErrors()) {
      console.log("Validation Bag Errors:", validationBag.hasErrors);
      return Result.fail(Failure.validation(validationBag));
    }

    const record = approvalRoutingModel.getRecord();
    await this._approvalRoutingMasterRepository.Create(record as any);

    return Result.ok(approvalRoutingModel.get("id"));
  }
}
