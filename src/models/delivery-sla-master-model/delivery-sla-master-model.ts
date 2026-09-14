import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IDeliverySLAMaster } from "@/schemas/delivery-sla-master-schema";

export class DeliverySLAMasterModel extends Model {
  public static make(record: Partial<IDeliverySLAMaster>): DeliverySLAMasterModel {
    const filteredRecord: Partial<IDeliverySLAMaster> = {
      _id: record._id,
      id: record.id,
      deliveryPeriodHours: record.deliveryPeriodHours,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new DeliverySLAMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "deliveryPeriodHours",
      Validation.make(this.get("deliveryPeriodHours")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}