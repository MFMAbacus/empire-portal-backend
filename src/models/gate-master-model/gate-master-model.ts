import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IGateMaster } from "@/schemas/gate-master-schema";

export class GateMasterModel extends Model {
  public static make(record: Partial<IGateMaster>): GateMasterModel {
    const filteredRecord: Partial<IGateMaster> = {
      _id: record._id,
      id: record.id,
      gateId:record.gateId,
      gateName: record.gateName,
      projectCode: record.projectCode,
      location: record.location,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new GateMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "gateId",
      Validation.make(this.get("gateId")).mandatory().string().getRule()
    );
    validationBag.set(
      "gateName",
      Validation.make(this.get("gateName")).mandatory().string().getRule()
    );
    validationBag.set(
      "location",
      Validation.make(this.get("location")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
