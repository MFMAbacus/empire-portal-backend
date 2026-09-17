import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { FacilityApprovalMasterModel } from "@/models/facility-approval-master-model";
import { FacilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

type Props = {
  facilityApprovalMasterRepository: FacilityApprovalMasterRepository;
};

export type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  approverRole: string;   // Coordinator Role / Name
  projectCode: string;
  isActive?: boolean;
};

export class CreateFacilityApprovalMasterService {
  protected _facilityApprovalMasterRepository: FacilityApprovalMasterRepository;

  public constructor(props: Props) {
    this._facilityApprovalMasterRepository = props.facilityApprovalMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._facilityApprovalMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.approverRole = input.approverRole || existing.approverRole;
        existing.isActive = isActive;

        await this._facilityApprovalMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'PMA' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("FA");

    const facilityApprovalModel = FacilityApprovalMasterModel.make({
      id: primaryKeyId,               // Database Primary Key -> PMA-12345
      approverRole: input.approverRole,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = facilityApprovalModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = facilityApprovalModel.getRecord();
    await this._facilityApprovalMasterRepository.Create(record as any);

    return Result.ok(facilityApprovalModel.get("id"));
  }
}