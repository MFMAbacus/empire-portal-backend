import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IApartmentMaster } from "@/schemas/apartment-master-schema";

export class ApartmentMasterModel extends Model {
  public static make(record: Partial<IApartmentMaster>): ApartmentMasterModel {
    const filteredRecord: Partial<IApartmentMaster> = {
      _id: record._id,
      id: record.id,
      apartmentId:record.apartmentId,
      apartmentNo: record.apartmentNo,
      buildingOrTower: record.buildingOrTower,
      floor: record.floor,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ApartmentMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "apartmentId",
      Validation.make(this.get("apartmentId")).mandatory().string().getRule()
    );
    validationBag.set(
      "apartmentNo",
      Validation.make(this.get("apartmentNo")).mandatory().string().getRule()
    );
    validationBag.set(
      "buildingOrTower",
      Validation.make(this.get("buildingOrTower")).mandatory().string().getRule()
    );
    validationBag.set(
      "floor",
      Validation.make(this.get("floor")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
