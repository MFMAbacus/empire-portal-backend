import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IAccessCardMaster } from "@/schemas/access-card-master-schema";

export class AccessCardMasterModel extends Model {
  public static make(record: Partial<IAccessCardMaster>): AccessCardMasterModel {
    const filteredRecord: Partial<IAccessCardMaster> = {
      _id: record._id,
      id: record.id,
      cardId: record.cardId,
      serialNo: record.serialNo,
      maskedSerial: record.maskedSerial,
      issueDate: record.issueDate,
      cardStatus: record.cardStatus,
      projectCode: record.projectCode,
      apartmentId: record.apartmentId,
      residentId: record.residentId,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new AccessCardMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "cardId",
      Validation.make(this.get("cardId")).mandatory().string().getRule()
    );
    validationBag.set(
      "serialNo",
      Validation.make(this.get("serialNo")).mandatory().string().getRule()
    );
    validationBag.set(
      "maskedSerial",
      Validation.make(this.get("maskedSerial")).mandatory().string().getRule()
    );
    validationBag.set(
      "issueDate",
      Validation.make(this.get("issueDate")).mandatory().string().getRule()
    );
    validationBag.set(
      "cardStatus",
      Validation.make(this.get("cardStatus")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "apartmentId",
      Validation.make(this.get("apartmentId")).mandatory().string().getRule()
    );
    validationBag.set(
      "residentId",
      Validation.make(this.get("residentId")).mandatory().string().getRule()
    );

    return validationBag;
  }
}