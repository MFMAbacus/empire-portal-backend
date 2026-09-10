import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IItemTypeMaster } from "@/schemas/item-type-master-schema";

export class ItemTypeMasterModel extends Model {
  public static make(record: Partial<IItemTypeMaster>): ItemTypeMasterModel {
    const filteredRecord: Partial<IItemTypeMaster> = {
      _id: record._id,
      id: record.id,
      itemTypeId: record.itemTypeId,
      itemTypeName: record.itemTypeName,
      description: record.description,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new ItemTypeMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "itemTypeId",
      Validation.make(this.get("itemTypeId")).mandatory().string().getRule()
    );
    validationBag.set(
      "itemTypeName",
      Validation.make(this.get("itemTypeName")).mandatory().string().getRule()
    );
    validationBag.set(
      "description",
      Validation.make(this.get("description")).mandatory().string().getRule()
    );

    return validationBag;
  }
}