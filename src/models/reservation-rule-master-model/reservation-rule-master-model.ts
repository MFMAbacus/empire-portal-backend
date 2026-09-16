import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IReservationRuleMaster } from "@/schemas/reservation-rule-master-schema";

export class ReservationRuleMasterModel extends Model {
  public static make(record: Partial<IReservationRuleMaster>): ReservationRuleMasterModel {
    const filteredRecord: Partial<IReservationRuleMaster> = {
      _id: record._id,
      id: record.id,
      slotDuration:record.slotDuration,
      maxGuest: record.maxGuest,
      lateArrival: record.lateArrival,
      venueId: record.venueId,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ReservationRuleMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "venueId",
      Validation.make(this.get("venueId")).mandatory().string().getRule()
    );
    validationBag.set(
      "slotDuration",
      Validation.make(this.get("slotDuration")).mandatory().number().getRule()
    );
    validationBag.set(
      "lateArrival",
      Validation.make(this.get("lateArrival")).mandatory().number().getRule()
    );

    return validationBag;
  }
}
