import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { PropertyManagementApprovalMasterModel } from "@/models/property-management-approval-master-model";
import { PropertyManagementApprovalMasterRepository } from "@/repositories/property-management-approval-master-repository";

type Props = {
  propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;
};

export type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  approverRole: string;   // Coordinator Role / Name
  projectCode: string;
  isActive?: boolean;
};

export class CreatePropertyManagementApprovalMasterService {
  protected _propertyManagementApprovalMasterRepository: PropertyManagementApprovalMasterRepository;

  public constructor(props: Props) {
    this._propertyManagementApprovalMasterRepository = props.propertyManagementApprovalMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._propertyManagementApprovalMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.approverRole = input.approverRole || existing.approverRole;
        existing.isActive = isActive;

        await this._propertyManagementApprovalMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'PMA' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("PMA");

    const propertyManagementApprovalModel = PropertyManagementApprovalMasterModel.make({
      id: primaryKeyId,               // Database Primary Key -> PMA-12345
      approverRole: input.approverRole,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = propertyManagementApprovalModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = propertyManagementApprovalModel.getRecord();
    await this._propertyManagementApprovalMasterRepository.Create(record as any);

    return Result.ok(propertyManagementApprovalModel.get("id"));
  }
}