import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { MenuMasterModel } from "@/models/menu-master-model";
import { MenuMasterRepository } from "@/repositories/menu-master-repository";

type Props = {
  menuMasterRepository: MenuMasterRepository;
};

type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  menuId: string;       // User Input Code (e.g. "APT-101")
  menuName: string;
  price: number;
  menuItem: string;
  venueId: string;
  isActive?: boolean;
};

export class CreateMenuMasterService {
  protected _menuMasterRepository: MenuMasterRepository;

  public constructor(props: Props) {
    this._menuMasterRepository = props.menuMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._menuMasterRepository.get(input.id);
      if (existing) {
        existing.venueId = input.venueId || existing.venueId;
        existing.menuId = input.menuId || existing.menuId;
        existing.menuName = input.menuName || existing.menuName;
        existing.price = input.price || existing.price;
        existing.menuItem = input.menuItem || existing.menuItem;
        existing.isActive = isActive;

        await this._menuMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'MM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("MM");

    const menuModel = MenuMasterModel.make({
      id: primaryKeyId,              // Database Primary Key -> <MM>-12345
      menuId: input.menuId, // User Input -> APT-101
      venueId: input.venueId,
      menuName: input.menuName,
      price: input.price,
      menuItem: input.menuItem,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = menuModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = menuModel.getRecord();
    await this._menuMasterRepository.Create(record as any);

    return Result.ok(menuModel.get("id"));
  }
}