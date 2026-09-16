import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ICourtMaster } from "@/schemas/court-master-schema";

export class CourtMasterModel extends Model {
  public static make(record: Partial<ICourtMaster>): CourtMasterModel {
    const filteredRecord: Partial<ICourtMaster> = {
      _id: record._id,
      id: record.id,
      courtId:record.courtId,
      courtName: record.courtName,
      courtType: record.courtType,
      location: record.location,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new CourtMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "courtId",
      Validation.make(this.get("courtId")).mandatory().string().getRule()
    );
    validationBag.set(
      "courtName",
      Validation.make(this.get("courtName")).mandatory().string().getRule()
    );
    validationBag.set(
      "courtType",
      Validation.make(this.get("courtType")).mandatory().string().getRule()
    );
    validationBag.set(
      "location",
      Validation.make(this.get("location")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
