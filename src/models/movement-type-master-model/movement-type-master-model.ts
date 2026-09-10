import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { IMovementTypeMaster } from "@/schemas/movement-type-master-schema";

export class MovementTypeMasterModel extends Model {
  public static make(record: Partial<IMovementTypeMaster>): MovementTypeMasterModel {
    const filteredRecord: Partial<IMovementTypeMaster> = {
      _id: record._id,
      id: record.id,
      movementTypeId: record.movementTypeId,
      type: record.type,
      isActive: record.isActive ?? true,
      isArchived: record.isArchived ?? false,
    };

    const model = new MovementTypeMasterModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "movementTypeId",
      Validation.make(this.get("movementTypeId")).mandatory().string().getRule()
    );
    validationBag.set(
      "type",
      Validation.make(this.get("type")).mandatory().string().getRule()
    );

    return validationBag;
  }
}