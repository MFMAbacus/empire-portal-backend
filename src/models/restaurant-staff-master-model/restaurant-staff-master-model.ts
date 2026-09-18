import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IRestaurantStaffMaster } from "@/schemas/restaurant-staff-master-schema";

export class RestaurantStaffMasterModel extends Model {
  public static make(record: Partial<IRestaurantStaffMaster>): RestaurantStaffMasterModel {
    const filteredRecord: Partial<IRestaurantStaffMaster> = {
      _id: record._id,
      id: record.id,
      approverRole: record.approverRole,
      role: record.role,
      venueId: record.venueId,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new RestaurantStaffMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "approverRole",
      Validation.make(this.get("approverRole")).mandatory().string().getRule()
    );
    validationBag.set(
      "venueId",
      Validation.make(this.get("venueId")).mandatory().string().getRule()
    );
    validationBag.set(
      "role",
      Validation.make(this.get("role")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}