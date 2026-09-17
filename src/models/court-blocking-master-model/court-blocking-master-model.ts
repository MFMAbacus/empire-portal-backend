import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ICourtBlockingMaster } from "@/schemas/court-blocking-master-schema";

export class CourtBlockingMasterModel extends Model {
  public static make(record: Partial<ICourtBlockingMaster>): CourtBlockingMasterModel {
    const filteredRecord: Partial<ICourtBlockingMaster> = {
      _id: record._id,
      id: record.id,
      blockId:record.blockId,
      blockDate: record.blockDate,
      startTime: record.startTime,
      endTime: record.endTime,
      reason: record.reason,
      createdBy: record.createdBy,
      courtId: record.courtId,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new CourtBlockingMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "courtId",
      Validation.make(this.get("courtId")).mandatory().string().getRule()
    );
    validationBag.set(
      "blockId",
      Validation.make(this.get("blockId")).mandatory().string().getRule()
    );
    validationBag.set(
      "blockDate",
      Validation.make(this.get("blockDate")).mandatory().string().getRule()
    );
    validationBag.set(
      "startTime",
      Validation.make(this.get("startTime")).mandatory().string().getRule()
    );
    validationBag.set(
      "endTime",
      Validation.make(this.get("endTime")).mandatory().string().getRule()
    );
    validationBag.set(
      "reason",
      Validation.make(this.get("reason")).mandatory().string().getRule()
    );
    validationBag.set(
      "createdBy",
      Validation.make(this.get("createdBy")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
