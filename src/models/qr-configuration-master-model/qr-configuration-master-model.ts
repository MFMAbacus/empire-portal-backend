import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IQRConfigurationMaster } from "@/schemas/qr-configuration-master-schema";

export class QRConfigurationMasterModel extends Model {
  public static make(record: Partial<IQRConfigurationMaster>): QRConfigurationMasterModel {
    const filteredRecord: Partial<IQRConfigurationMaster> = {
      _id: record._id,
      id: record.id,
      qrConfigId: record.qrConfigId,
      expiryHours: record.expiryHours,
      isOneTimeScan: record.isOneTimeScan ?? false,
      isGateValidation: record.isGateValidation ?? false,
      isPdfRequired: record.isPdfRequired ?? false,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new QRConfigurationMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "qrConfigId",
      Validation.make(this.get("qrConfigId")).mandatory().string().getRule()
    );
    validationBag.set(
      "expiryHours",
      Validation.make(this.get("expiryHours")).mandatory().number().getRule()
    );

    return validationBag;
  }
}