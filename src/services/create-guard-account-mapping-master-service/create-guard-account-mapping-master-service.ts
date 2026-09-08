import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { GuardAccountMappingMasterModel } from "@/models/guard-account-mapping-master-model";
import { GuardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

type Props = {
  guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;
};

type Input = {
  id?: string;           // Database Primary Key (Edit mode me)
  guardAccountId?: string;   // Unique guard Code
  guardUserId: string;
  deviceId: string;
  gateId: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateGuardAccountMappingMasterService {
  protected _guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;

  public constructor(props: Props) {
    this._guardAccountMappingMasterRepository = props.guardAccountMappingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._guardAccountMappingMasterRepository.get(input.id);
      if (existing) {
        existing.guardAccountId = input.guardAccountId || existing.guardAccountId;
        existing.guardUserId = input.guardUserId || existing.guardUserId;
        existing.deviceId = input.deviceId || existing.deviceId;
        existing.gateId = input.gateId || existing.gateId;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.isActive = isActive;

        await this._guardAccountMappingMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("RM");
    const guardAccountId = input.guardAccountId || Generator.id("RES");

    const guardAccountMappingModel = GuardAccountMappingMasterModel.make({
      id: primaryKeyId,
      guardAccountId: guardAccountId,
      guardUserId: input.guardUserId,
      deviceId: input.deviceId,
      gateId: input.gateId,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = guardAccountMappingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = guardAccountMappingModel.getRecord();
    await this._guardAccountMappingMasterRepository.Create(record as any);

    return Result.ok(guardAccountMappingModel.get("id"));
  }
}