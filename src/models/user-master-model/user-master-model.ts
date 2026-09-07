import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IUserMaster } from "@/schemas/user-master-schema";

export class UserMasterModel extends Model {
  public static make(record: Partial<IUserMaster>): UserMasterModel {
    const filteredRecord: Partial<IUserMaster> = {
      _id: record._id,
      id: record.id,
      userId: record.userId,
      name: record.name,
      role: record.role,
      assignedModule: record.assignedModule,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new UserMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "userId",
      Validation.make(this.get("userId")).mandatory().string().getRule()
    );
    validationBag.set(
      "name",
      Validation.make(this.get("name")).mandatory().string().getRule()
    );
    validationBag.set(
      "role",
      Validation.make(this.get("role")).mandatory().string().getRule()
    );
    validationBag.set(
      "assignedModule",
      Validation.make(this.get("assignedModule")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}