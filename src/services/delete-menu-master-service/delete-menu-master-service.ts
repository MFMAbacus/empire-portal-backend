import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { MenuMasterRepository } from "@/repositories/menu-master-repository";

type Props = {
  menuMasterRepository: MenuMasterRepository;
};

type Input = {
  id?: string;
  menuId?: string;
  isRestore?: boolean | string;
};

export class DeleteMenuMasterService {
  protected _menuMasterRepository: MenuMasterRepository;

  public constructor(props: Props) {
    this._menuMasterRepository = props.menuMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.menuId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._menuMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._menuMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
