import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IProjectCourtMaster } from "@/schemas/project-court-master-schema";

export class ProjectCourtMasterModel extends Model {
  public static make(record: Partial<IProjectCourtMaster>): ProjectCourtMasterModel {
    const filteredRecord: Partial<IProjectCourtMaster> = {
      _id: record._id,
      id: record.id,
      courtId: record.courtId,
      projectCode: record.projectCode,
      isAccess: record.isAccess ?? false,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ProjectCourtMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "courtId",
      Validation.make(this.get("courtId")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}