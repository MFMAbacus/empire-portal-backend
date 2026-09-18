import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { ICommonStatusMaster } from "@/schemas/common-status-master-schema";

export class CommonStatusMasterModel extends Model {
  public static make(record: Partial<ICommonStatusMaster>): CommonStatusMasterModel {
    const filteredRecord: Partial<ICommonStatusMaster> = {
      _id: record._id,
      id: record.id,
      statusCode: record.statusCode,
      module: record.module,
      statusName: record.statusName,
      sequence: record.sequence,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new CommonStatusMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "statusCode",
      Validation.make(this.get("statusCode")).mandatory().string().getRule()
    );
    validationBag.set(
      "module",
      Validation.make(this.get("module")).mandatory().string().getRule()
    );
    validationBag.set(
      "statusName",
      Validation.make(this.get("statusName")).mandatory().string().getRule()
    );
    validationBag.set(
      "sequence",
      Validation.make(this.get("sequence")).mandatory().number().getRule()
    );

    return validationBag;
  }
}
