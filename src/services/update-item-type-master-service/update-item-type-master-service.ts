import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ItemTypeMasterModel } from "@/models/item-type-master-model";
import { ItemTypeMasterRepository } from "@/repositories/item-type-master-repository";

type Props = {
  itemTypeMasterRepository: ItemTypeMasterRepository;
};

type Input = {
  id?: string;              // Database Primary Key ID (e.g. "IT-12345")
  itemTypeId: string;   // User Input Code (e.g. "IT-01")
  itemTypeName: string;            
  description: string;
  isActive?: boolean;
};

export class UpdateItemTypeMasterService {
  protected _itemTypeMasterRepository: ItemTypeMasterRepository;

  public constructor(props: Props) {
    this._itemTypeMasterRepository = props.itemTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input itemTypeId
    const targetId = input.id || input.itemTypeId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._itemTypeMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const itemTypeModel = ItemTypeMasterModel.make({
      id: targetId,
      itemTypeId: input.itemTypeId || record.itemTypeId,
      itemTypeName: input.itemTypeName || record.itemTypeName,
      description: input.description || record.description,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = itemTypeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = itemTypeModel.getRecord();
    await this._itemTypeMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}