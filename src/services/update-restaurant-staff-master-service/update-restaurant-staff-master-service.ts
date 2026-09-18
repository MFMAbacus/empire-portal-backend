import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { RestaurantStaffMasterModel } from "@/models/restaurant-staff-master-model";
import { RestaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

type Props = {
  restaurantStaffMasterRepository: RestaurantStaffMasterRepository;
};

type Input = {
  id?: string;              // Database primary key ID
  approverRole: string;
  role:string;
  venueId:string;
  projectCode: string;
  isActive?: boolean;
};

export class UpdateRestaurantStaffMasterService {
  protected _restaurantStaffMasterRepository: RestaurantStaffMasterRepository;

  public constructor(props: Props) {
    this._restaurantStaffMasterRepository = props.restaurantStaffMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._restaurantStaffMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with RestaurantStaffMasterModel before saving
    const restaurantStaffModel = RestaurantStaffMasterModel.make({
      id: targetId,
      approverRole: input.approverRole || record.approverRole,
      role: input.role || record.role,
      venueId: input.venueId || record.venueId,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = restaurantStaffModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = restaurantStaffModel.getRecord();
    await this._restaurantStaffMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}