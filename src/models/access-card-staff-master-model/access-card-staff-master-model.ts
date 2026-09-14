import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IAccessCardStaffMaster } from "@/schemas/access-card-staff-master-schema";

export class AccessCardStaffMasterModel extends Model {
  public static make(record: Partial<IAccessCardStaffMaster>): AccessCardStaffMasterModel {
    const filteredRecord: Partial<IAccessCardStaffMaster> = {
      _id: record._id,
      id: record.id,
      staffRole: record.staffRole,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new AccessCardStaffMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "staffRole",
      Validation.make(this.get("staffRole")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}