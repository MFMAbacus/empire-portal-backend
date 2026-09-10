import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IPropertyManagementApprovalMaster } from "@/schemas/property-management-approval-master-schema";

export class PropertyManagementApprovalMasterModel extends Model {
  public static make(record: Partial<IPropertyManagementApprovalMaster>): PropertyManagementApprovalMasterModel {
    const filteredRecord: Partial<IPropertyManagementApprovalMaster> = {
      _id: record._id,
      id: record.id,
      approverRole: record.approverRole,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new PropertyManagementApprovalMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "approverRole",
      Validation.make(this.get("approverRole")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}