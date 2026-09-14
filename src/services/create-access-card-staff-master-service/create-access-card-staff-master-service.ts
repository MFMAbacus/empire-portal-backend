import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { AccessCardStaffMasterModel } from "@/models/access-card-staff-master-model";
import { AccessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

type Props = {
  accessCardStaffMasterRepository: AccessCardStaffMasterRepository;
};

export type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  staffRole: string;   // Coordinator Role / Name
  projectCode: string;
  isActive?: boolean;
};

export class CreateAccessCardStaffMasterService {
  protected _accessCardStaffMasterRepository: AccessCardStaffMasterRepository;

  public constructor(props: Props) {
    this._accessCardStaffMasterRepository = props.accessCardStaffMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._accessCardStaffMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.staffRole = input.staffRole || existing.staffRole;
        existing.isActive = isActive;

        await this._accessCardStaffMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'ACS' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("ACS");

    const accessCardStaffModel = AccessCardStaffMasterModel.make({
      id: primaryKeyId,               // Database Primary Key -> ACS-12345
      staffRole: input.staffRole,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = accessCardStaffModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = accessCardStaffModel.getRecord();
    await this._accessCardStaffMasterRepository.Create(record as any);

    return Result.ok(accessCardStaffModel.get("id"));
  }
}