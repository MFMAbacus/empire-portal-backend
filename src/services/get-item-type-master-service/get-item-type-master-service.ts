import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IItemTypeMaster } from "@/schemas/item-type-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ItemTypeMasterRepository } from "@/repositories/item-type-master-repository";

type Props = {
  itemTypeMasterRepository: ItemTypeMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetItemTypeMasterService {
  protected _itemTypeMasterRepository: ItemTypeMasterRepository;

  public constructor(props: Props) {
    this._itemTypeMasterRepository = props.itemTypeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IItemTypeMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._itemTypeMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
