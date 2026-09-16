import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IMenuMaster } from "@/schemas/menu-master-schema";

export class MenuMasterModel extends Model {
  public static make(record: Partial<IMenuMaster>): MenuMasterModel {
    const filteredRecord: Partial<IMenuMaster> = {
      _id: record._id,
      id: record.id,
      menuId:record.menuId,
      menuName: record.menuName,
      price: record.price,
      menuItem: record.menuItem,
      venueId: record.venueId,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new MenuMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "venueId",
      Validation.make(this.get("venueId")).mandatory().string().getRule()
    );
    validationBag.set(
      "menuId",
      Validation.make(this.get("menuId")).mandatory().string().getRule()
    );
    validationBag.set(
      "menuName",
      Validation.make(this.get("menuName")).mandatory().string().getRule()
    );
    validationBag.set(
      "menuItem",
      Validation.make(this.get("menuItem")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
