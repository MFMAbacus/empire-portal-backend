import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IMovementRuleMaster } from "@/schemas/movement-rule-master-schema";

export class MovementRuleMasterModel extends Model {
  public static make(record: Partial<IMovementRuleMaster>): MovementRuleMasterModel {
    const filteredRecord: Partial<IMovementRuleMaster> = {
      _id: record._id,
      id: record.id,
      ruleId: record.ruleId,
      projectCode: record.projectCode,
      startTime: record.startTime,
      endTime: record.endTime,
      blockedDays: record.blockedDays,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new MovementRuleMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "startTime",
      Validation.make(this.get("startTime")).mandatory().string().getRule()
    );
    validationBag.set(
      "endTime",
      Validation.make(this.get("endTime")).mandatory().string().getRule()
    );

    return validationBag;
  }
}