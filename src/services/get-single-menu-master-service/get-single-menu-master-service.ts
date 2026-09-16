import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IMenuMaster } from "@/schemas/menu-master-schema";
import { MenuMasterRepository } from "@/repositories/menu-master-repository";

type Props = {
  menuMasterRepository: MenuMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleMenuMasterService {
  protected _menuMasterRepository: MenuMasterRepository;

  public constructor(props: Props) {
    this._menuMasterRepository = props.menuMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IMenuMaster, Failure>> {
    const property = await this._menuMasterRepository.get(input.id);
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
