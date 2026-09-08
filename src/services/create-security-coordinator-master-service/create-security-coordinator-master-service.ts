import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { SecurityCoordinatorMasterModel } from "@/models/security-coordinator-master-model";
import { SecurityCoordinatorMasterRepository } from "@/repositories/security-coordinator-master-repository";

type Props = {
  securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;
};

export type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  coordinatorRole: string;   // Coordinator Role / Name
  projectCode: string;
  isActive?: boolean;
};

export class CreateSecurityCoordinatorMasterService {
  protected _securityCoordinatorMasterRepository: SecurityCoordinatorMasterRepository;

  public constructor(props: Props) {
    this._securityCoordinatorMasterRepository = props.securityCoordinatorMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._securityCoordinatorMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.coordinatorRole = input.coordinatorRole || existing.coordinatorRole;
        existing.isActive = isActive;

        await this._securityCoordinatorMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'SCM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("SCM");

    const securityCoordinatorModel = SecurityCoordinatorMasterModel.make({
      id: primaryKeyId,               // Database Primary Key -> SCM-12345
      coordinatorRole: input.coordinatorRole,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = securityCoordinatorModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = securityCoordinatorModel.getRecord();
    await this._securityCoordinatorMasterRepository.Create(record as any);

    return Result.ok(securityCoordinatorModel.get("id"));
  }
}