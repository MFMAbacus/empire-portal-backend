import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ICourtOperatingMaster } from "@/schemas/court-operating-master-schema";

export class CourtOperatingMasterModel extends Model {
  public static make(record: Partial<ICourtOperatingMaster>): CourtOperatingMasterModel {
    const filteredRecord: Partial<ICourtOperatingMaster> = {
      _id: record._id,
      id: record.id,
      courtId: record.courtId,
      day: record.day,
      openTime:record.openTime,
      closeTime:record.closeTime,
      isClosed: record.isClosed ?? false,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new CourtOperatingMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "courtId",
      Validation.make(this.get("courtId")).mandatory().string().getRule()
    );
    validationBag.set(
      "day",
      Validation.make(this.get("day")).mandatory().string().getRule()
    );
    validationBag.set(
      "openTime",
      Validation.make(this.get("openTime")).mandatory().string().getRule()
    );
    
    validationBag.set(
      "closeTime",
      Validation.make(this.get("closeTime")).mandatory().string().getRule()
    );

    return validationBag;
  }
}