import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IProjectVenueMaster } from "@/schemas/project-venue-master-schema";

export class ProjectVenueMasterModel extends Model {
  public static make(record: Partial<IProjectVenueMaster>): ProjectVenueMasterModel {
    const filteredRecord: Partial<IProjectVenueMaster> = {
      _id: record._id,
      id: record.id,
      venueId: record.venueId,
      projectCode: record.projectCode,
      isAccess: record.isAccess ?? false,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ProjectVenueMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "venueId",
      Validation.make(this.get("venueId")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}