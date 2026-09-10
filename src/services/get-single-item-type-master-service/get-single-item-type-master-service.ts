import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IItemTypeMaster } from "@/schemas/item-type-master-schema";
import { ItemTypeMasterRepository } from "@/repositories/item-type-master-repository";

type Props = {
  itemTypeMasterRepository: ItemTypeMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleItemTypeMasterService {
  protected _itemTypeMasterRepository: ItemTypeMasterRepository;

  public constructor(props: Props) {
    this._itemTypeMasterRepository = props.itemTypeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IItemTypeMaster, Failure>> {
    const property = await this._itemTypeMasterRepository.get(input.id);
    if (!property) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (property as any).toObject === "function" ? (property as any).toObject() : { ...property };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}
