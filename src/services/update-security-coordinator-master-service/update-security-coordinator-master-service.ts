import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { SecurityCoordinatorMasterModel } from "@/models/security-coordinator-master-model";
import { SecurityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

type Props = {
  securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;
};

type Input = {
  id?: string;              // Database primary key ID
  coordinatorRole: string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateSecurityCoordinatorMasterService {
  protected _securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;

  public constructor(props: Props) {
    this._securityCoordinatorMasterRepository = props.securityCoordinatorMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._securityCoordinatorMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with SecurityCoordinatorMasterModel before saving
    const securityCoordinatorModel = SecurityCoordinatorMasterModel.make({
      id: targetId,
      coordinatorRole: input.coordinatorRole || record.coordinatorRole,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = securityCoordinatorModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = securityCoordinatorModel.getRecord();
    await this._securityCoordinatorMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}