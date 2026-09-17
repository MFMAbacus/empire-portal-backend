import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ICourtBookingMaster } from "@/schemas/court-booking-master-schema";

export class CourtBookingMasterModel extends Model {
  public static make(record: Partial<ICourtBookingMaster>): CourtBookingMasterModel {
    const filteredRecord: Partial<ICourtBookingMaster> = {
      _id: record._id,
      id: record.id,
      maxBooking: record.maxBooking,
      projectCode: record.projectCode,
      advanceBooking: record.advanceBooking,
      pendingSlot: record.pendingSlot ?? false,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new CourtBookingMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "maxBooking",
      Validation.make(this.get("maxBooking")).mandatory().number().getRule()
    );
    validationBag.set(
      "advanceBooking",
      Validation.make(this.get("advanceBooking")).mandatory().number().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}