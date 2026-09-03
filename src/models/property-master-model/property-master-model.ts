import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IPropertyMaster } from "@/schemas/property-master-schema";

export class PropertyMasterModel extends Model {
  public static make(record: Partial<IPropertyMaster>): PropertyMasterModel {
    const filteredRecord: Partial<IPropertyMaster> = {
      _id: record._id,
      id: record.id,
      projectCode: record.projectCode,
      projectName: record.projectName,
      propertyName: record.propertyName,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new PropertyMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectName",
      Validation.make(this.get("projectName")).mandatory().string().getRule()
    );
    validationBag.set(
      "propertyName",
      Validation.make(this.get("propertyName")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
