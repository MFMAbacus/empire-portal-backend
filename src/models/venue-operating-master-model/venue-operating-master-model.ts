import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IVenueOperatingMaster } from "@/schemas/venue-operating-master-schema";

export class VenueOperatingMasterModel extends Model {
  public static make(record: Partial<IVenueOperatingMaster>): VenueOperatingMasterModel {
    const filteredRecord: Partial<IVenueOperatingMaster> = {
      _id: record._id,
      id: record.id,
      venueId: record.venueId,
      day: Array.isArray(record.day) ? record.day : record.day ? [record.day] : [],
      openTime:record.openTime,
      closeTime:record.closeTime,
      isClosed: record.isClosed ?? false,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new VenueOperatingMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "venueId",
      Validation.make(this.get("venueId")).mandatory().string().getRule()
    );
        const days = this.get("day");
    if (!Array.isArray(days) || days.length === 0) {
      validationBag.set(
        "day",
        Validation.make(days).mandatory().getRule()
      );
    }
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