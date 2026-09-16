import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { MenuMasterModel } from "@/models/menu-master-model";
import { MenuMasterRepository } from "@/repositories/menu-master-repository";

type Props = {
  menuMasterRepository: MenuMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "1")
  menuId: string;     // User Input Code (e.g., "APT-101")
  menuName: string;
  price: number;
  menuItem: string;
  venueId: string;
  isActive?: boolean;
};

export class UpdateMenuMasterService {
  protected _menuMasterRepository: MenuMasterRepository;

  public constructor(props: Props) {
    this._menuMasterRepository = props.menuMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input menuId
    const targetId = input.id || input.menuId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._menuMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const menuModel = MenuMasterModel.make({
      id: targetId,
      menuId: input.menuId || record.menuId,
      menuName: input.menuName || record.menuName,
      price: input.price || record.price,
      menuItem: input.menuItem || record.menuItem,
      venueId: input.venueId || record.venueId,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = menuModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = menuModel.getRecord();
    await this._menuMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}