import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GuardAccountMappingMasterModel } from "@/models/guard-account-mapping-master-model";
import { GuardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

type Props = {
  guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;
};

type Input = {
  id?: string;             // Database record ID
  guardAccountId: string;      // Unique guard Identifier
  guardUserId?: string;
  deviceId?: string;
  gateId?: string;
  projectCode?: string;
  isActive?: boolean;
};

export class UpdateGuardAccountMappingMasterService {
  protected _guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;

  public constructor(props: Props) {
    this._guardAccountMappingMasterRepository = props.guardAccountMappingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to guardaccountId
    const targetId = input.id || input.guardAccountId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._guardAccountMappingMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Model me guard fields map aur validate kar rahe hain (naya input ya purana fallback)
    const guardModel = GuardAccountMappingMasterModel.make({
      id: targetId,
      guardAccountId: input.guardAccountId || record.guardAccountId,
      guardUserId: input.guardUserId || record.guardUserId,
      deviceId: input.deviceId || record.deviceId,
      gateId: input.gateId || record.gateId,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = guardModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = guardModel.getRecord();
    await this._guardAccountMappingMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}