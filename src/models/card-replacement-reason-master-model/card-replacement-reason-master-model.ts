import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ICardReplacementReasonMaster } from "@/schemas/card-replacement-reason-master-schema";

export class CardReplacementReasonMasterModel extends Model {
  public static make(record: Partial<ICardReplacementReasonMaster>): CardReplacementReasonMasterModel {
    const filteredRecord: Partial<ICardReplacementReasonMaster> = {
      _id: record._id,
      id: record.id,
      reasonId: record.reasonId,
      reasonName: record.reasonName,
      chargesApplicable: record.chargesApplicable ?? false,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new CardReplacementReasonMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "reasonId",
      Validation.make(this.get("reasonId")).mandatory().string().getRule()
    );
    validationBag.set(
      "reasonName",
      Validation.make(this.get("reasonName")).mandatory().string().getRule()
    );

    return validationBag;
  }
}