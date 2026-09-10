import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { PropertyManagementApprovalMasterModel } from "@/models/property-management-approval-master-model";
import { PropertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

type Props = {
  propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;
};

type Input = {
  id?: string;              // Database primary key ID
  approverRole: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdatePropertyManagementApprovalMasterService {
  protected _propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;

  public constructor(props: Props) {
    this._propertyManagementApprovalMasterRepository = props.propertyManagementApprovalMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._propertyManagementApprovalMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with PropertyManagementApprovalMasterModel before saving
    const propertyManagementApprovalModel = PropertyManagementApprovalMasterModel.make({
      id: targetId,
      approverRole: input.approverRole || record.approverRole,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = propertyManagementApprovalModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = propertyManagementApprovalModel.getRecord();
    await this._propertyManagementApprovalMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}