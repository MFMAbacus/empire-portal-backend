import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ItemTypeMasterModel } from "@/models/item-type-master-model";
import { ItemTypeMasterRepository } from "@/repositories/item-type-master-repository";

type Props = {
  itemTypeMasterRepository: ItemTypeMasterRepository;
};

type Input = {
  id?: string;              // Database Primary Key (Edit mode me hi aayega)
  itemTypeId: string;   // User Input Code (e.g. "MT-01")
  itemTypeName: string;
  description: string;
  isActive?: boolean;
};

export class CreateItemTypeMasterService {
  protected _itemTypeMasterRepository: ItemTypeMasterRepository;

  public constructor(props: Props) {
    this._itemTypeMasterRepository = props.itemTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._itemTypeMasterRepository.get(input.id);
      if (existing) {
        existing.itemTypeId = input.itemTypeId || existing.itemTypeId;
        existing.itemTypeName = input.itemTypeName || existing.itemTypeName;
        existing.description =input.description || existing.description;
        existing.isActive = isActive;

        await this._itemTypeMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'MT' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("IT");

    const itemTypeModel = ItemTypeMasterModel.make({
      id: primaryKeyId,                  // Database Primary Key -> MT-12345
      itemTypeId: input.itemTypeId, // User Input -> MT-01
      itemTypeName : input.itemTypeName,
      description: input.description,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = itemTypeModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = itemTypeModel.getRecord();
    await this._itemTypeMasterRepository.Create(record as any);

    return Result.ok(itemTypeModel.get("id"));
  }
}