import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IGuardAccountMappingMaster } from "@/schemas/guard-account-mapping-master-schema";

export class GuardAccountMappingMasterModel extends Model {
  public static make(record: Partial<IGuardAccountMappingMaster>): GuardAccountMappingMasterModel {
    const filteredRecord: Partial<IGuardAccountMappingMaster> = {
      _id: record._id,
      id: record.id,
      guardAccountId: record.guardAccountId,
      guardUserId: record.guardUserId,
      gateId: record.gateId,
      deviceId: record.deviceId,
      projectCode: record.projectCode,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new GuardAccountMappingMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "guardAccountId",
      Validation.make(this.get("guardAccountId")).mandatory().string().getRule()
    );
    validationBag.set(
      "guardUserId",
      Validation.make(this.get("guardUserId")).mandatory().string().getRule()
    );
    validationBag.set(
      "gateId",
      Validation.make(this.get("gateId")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectCode",
      Validation.make(this.get("projectCode")).mandatory().string().getRule()
    );

    return validationBag;
  }
}