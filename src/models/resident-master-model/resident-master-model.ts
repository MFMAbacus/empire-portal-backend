import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IResidentMaster } from "@/schemas/resident-master-schema";

export class ResidentMasterModel extends Model {
  public static make(record: Partial<IResidentMaster>): ResidentMasterModel {
    const filteredRecord: Partial<IResidentMaster> = {
      _id: record._id,
      id: record.id,
      residentId: record.residentId,
      name: record.name,
      email: record.email,
      mobileNo: record.mobileNo,
      loginUserId: record.loginUserId,
      residentType: record.residentType,
      apartmentId: record.apartmentId,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ResidentMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "residentId",
      Validation.make(this.get("residentId")).mandatory().string().getRule()
    );
    validationBag.set(
      "name",
      Validation.make(this.get("name")).mandatory().string().getRule()
    );
    validationBag.set(
      "email",
      Validation.make(this.get("email")).mandatory().string().getRule()
    );
    validationBag.set(
      "mobileNo",
      Validation.make(this.get("mobileNo")).mandatory().number().getRule()
    );
    validationBag.set(
      "residentType",
      Validation.make(this.get("residentType")).mandatory().string().getRule()
    );
    validationBag.set(
      "apartmentId",
      Validation.make(this.get("apartmentId")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}