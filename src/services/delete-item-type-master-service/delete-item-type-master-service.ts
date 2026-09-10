import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ItemTypeMasterRepository } from "@/repositories/item-type-master-repository";

type Props = {
  itemTypeMasterRepository: ItemTypeMasterRepository;
};

type Input = {
  id?: string;
  itemTypeId?: string;
  isRestore?: boolean | string;
};

export class DeleteItemTypeMasterService {
  protected _itemTypeMasterRepository: ItemTypeMasterRepository;

  public constructor(props: Props) {
    this._itemTypeMasterRepository = props.itemTypeMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.itemTypeId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();

    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._itemTypeMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore =
      input.isRestore === true ||
      input.isRestore === "1" ||
      input.isRestore === "true";

    record.isArchived = !isRestore;
    await this._itemTypeMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}