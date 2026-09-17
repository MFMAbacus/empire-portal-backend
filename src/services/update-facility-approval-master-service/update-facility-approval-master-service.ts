import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { FacilityApprovalMasterModel } from "@/models/facility-approval-master-model";
import { FacilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

type Props = {
  facilityApprovalMasterRepository: FacilityApprovalMasterRepository;
};

type Input = {
  id?: string;              // Database primary key ID
  approverRole: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateFacilityApprovalMasterService {
  protected _facilityApprovalMasterRepository: FacilityApprovalMasterRepository;

  public constructor(props: Props) {
    this._facilityApprovalMasterRepository = props.facilityApprovalMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._facilityApprovalMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with FacilityApprovalMasterModel before saving
    const facilityApprovalModel = FacilityApprovalMasterModel.make({
      id: targetId,
      approverRole: input.approverRole || record.approverRole,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = facilityApprovalModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = facilityApprovalModel.getRecord();
    await this._facilityApprovalMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}