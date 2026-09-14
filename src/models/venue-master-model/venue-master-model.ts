import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IVenueMaster } from "@/schemas/venue-master-schema";

export class VenueMasterModel extends Model {
  public static make(record: Partial<IVenueMaster>): VenueMasterModel {
    const filteredRecord: Partial<IVenueMaster> = {
      _id: record._id,
      id: record.id,
      venueId: record.venueId,
      venueName: record.venueName,
      type: record.type,
      projectCode: record.projectCode,
      location: record.location,
      contact: record.contact,
      description: record.description,
      imageOrLogo: record.imageOrLogo,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new VenueMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "venueId",
      Validation.make(this.get("venueId")).mandatory().string().getRule()
    );
    validationBag.set(
      "venueName",
      Validation.make(this.get("venueName")).mandatory().string().getRule()
    );
    validationBag.set(
      "type",
      Validation.make(this.get("type")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "location",
      Validation.make(this.get("location")).mandatory().string().getRule()
    );
    validationBag.set(
      "contact",
      Validation.make(this.get("contact")).mandatory().string().getRule()
    );

    return validationBag;
  }
}