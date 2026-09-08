import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ISecurityCoordinatorMaster } from "@/schemas/security-coordinator-master-schema";

export class SecurityCoordinatorMasterModel extends Model {
  public static make(record: Partial<ISecurityCoordinatorMaster>): SecurityCoordinatorMasterModel {
    const filteredRecord: Partial<ISecurityCoordinatorMaster> = {
      _id: record._id,
      id: record.id,
      coordinatorRole: record.coordinatorRole,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new SecurityCoordinatorMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "coordinatorRole",
      Validation.make(this.get("coordinatorRole")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}