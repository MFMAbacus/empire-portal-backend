import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IRestaurantStaffMaster } from "@/schemas/restaurant-staff-master-schema";
import { RestaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

type Props = {
  restaurantStaffMasterRepository: RestaurantStaffMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleRestaurantStaffMasterService {
  protected _restaurantStaffMasterRepository: RestaurantStaffMasterRepository;

  public constructor(props: Props) {
    this._restaurantStaffMasterRepository = props.restaurantStaffMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IRestaurantStaffMaster, Failure>> {
    const record = await this._restaurantStaffMasterRepository.get(input.id);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (record as any).toObject === "function" ? (record as any).toObject() : { ...record };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}