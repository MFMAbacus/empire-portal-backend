import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { RestaurantStaffMasterModel } from "@/models/restaurant-staff-master-model";
import { RestaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

type Props = {
  restaurantStaffMasterRepository: RestaurantStaffMasterRepository;
};

export type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  approverRole: string;   // Coordinator Role / Name
  role: string;
  venueId: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateRestaurantStaffMasterService {
  protected _restaurantStaffMasterRepository: RestaurantStaffMasterRepository;

  public constructor(props: Props) {
    this._restaurantStaffMasterRepository = props.restaurantStaffMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._restaurantStaffMasterRepository.get(input.id);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.role = input.role || existing.role;
        existing.venueId = input.venueId || existing.venueId;
        existing.approverRole = input.approverRole || existing.approverRole;
        existing.isActive = isActive;

        await this._restaurantStaffMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'PMA' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("RS");

    const restaurantStaffModel = RestaurantStaffMasterModel.make({
      id: primaryKeyId,               // Database Primary Key -> PMA-12345
      approverRole: input.approverRole,
      role: input.role,
      venueId: input.venueId,
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = restaurantStaffModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = restaurantStaffModel.getRecord();
    await this._restaurantStaffMasterRepository.Create(record as any);

    return Result.ok(restaurantStaffModel.get("id"));
  }
}