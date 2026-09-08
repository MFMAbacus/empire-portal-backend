import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IVehicleTypeMaster } from "@/schemas/vehicle-type-master-schema";

export class VehicleTypeMasterModel extends Model {
  public static make(record: Partial<IVehicleTypeMaster>): VehicleTypeMasterModel {
    const filteredRecord: Partial<IVehicleTypeMaster> = {
      _id: record._id,
      id: record.id,
      vehicleTypeId: record.vehicleTypeId,
      vehicleType: record.vehicleType,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new VehicleTypeMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "vehicleTypeId",
      Validation.make(this.get("vehicleTypeId")).mandatory().string().getRule()
    );
    validationBag.set(
      "vehicleType",
      Validation.make(this.get("vehicleType")).mandatory().string().getRule()
    );

    return validationBag;
  }
}