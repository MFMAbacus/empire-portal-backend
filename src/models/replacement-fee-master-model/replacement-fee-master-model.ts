import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IReplacementFeeMaster } from "@/schemas/replacement-fee-master-schema";

export class ReplacementFeeMasterModel extends Model {
  public static make(record: Partial<IReplacementFeeMaster>): ReplacementFeeMasterModel {
    const filteredRecord: Partial<IReplacementFeeMaster> = {
      _id: record._id,
      id: record.id,
      feeId: record.feeId,
      feeAmount: record.feeAmount,
      currency: record.currency,
      tax: record.tax,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ReplacementFeeMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "feeId",
      Validation.make(this.get("feeId")).mandatory().string().getRule()
    );
    validationBag.set(
      "feeAmount",
      Validation.make(this.get("feeAmount")).mandatory().number().getRule()
    );
    validationBag.set(
      "currency",
      Validation.make(this.get("currency")).mandatory().string().getRule()
    );

    return validationBag;
  }
}