import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ICourtTimeMaster } from "@/schemas/court-time-master-schema";

export class CourtTimeMasterModel extends Model {
  public static make(record: Partial<ICourtTimeMaster>): CourtTimeMasterModel {
    const filteredRecord: Partial<ICourtTimeMaster> = {
      _id: record._id,
      id: record.id,
      courtId: record.courtId,
      startTime:record.startTime,
      endTime:record.endTime,
      slotDuration: record.slotDuration,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new CourtTimeMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "courtId",
      Validation.make(this.get("courtId")).mandatory().string().getRule()
    );
    validationBag.set(
      "slotDuration",
      Validation.make(this.get("slotDuration")).mandatory().number().getRule()
    );
    validationBag.set(
      "startTime",
      Validation.make(this.get("startTime")).mandatory().string().getRule()
    );
    
    validationBag.set(
      "endTime",
      Validation.make(this.get("endTime")).mandatory().string().getRule()
    );

    return validationBag;
  }
}