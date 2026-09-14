import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { AccessCardStaffMasterModel } from "@/models/access-card-staff-master-model";
import { AccessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

type Props = {
  accessCardStaffMasterRepository: AccessCardStaffMasterRepository;
};

type Input = {
  id?: string;              // Database primary key ID
  staffRole: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateAccessCardStaffMasterService {
  protected _accessCardStaffMasterRepository: AccessCardStaffMasterRepository;

  public constructor(props: Props) {
    this._accessCardStaffMasterRepository = props.accessCardStaffMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._accessCardStaffMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with AccessCardStaffMasterModel before saving
    const accessCardStaffModel = AccessCardStaffMasterModel.make({
      id: targetId,
      staffRole: input.staffRole || record.staffRole,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = accessCardStaffModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = accessCardStaffModel.getRecord();
    await this._accessCardStaffMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}