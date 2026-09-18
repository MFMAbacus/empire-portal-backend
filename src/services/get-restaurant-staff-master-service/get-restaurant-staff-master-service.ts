import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IRestaurantStaffMaster } from "@/schemas/restaurant-staff-master-schema";
import { SessionRecord } from "@/records/session-record";
import { RestaurantStaffMasterRepository } from "@/repositories/restaurant-staff-master-repository";

type Props = {
  restaurantStaffMasterRepository: RestaurantStaffMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetRestaurantStaffMasterService {
  protected _restaurantStaffMasterRepository: RestaurantStaffMasterRepository;

  public constructor(props: Props) {
    this._restaurantStaffMasterRepository = props.restaurantStaffMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IRestaurantStaffMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const coordinators = await this._restaurantStaffMasterRepository.getAll({ isArchived });

    const mappedCoordinators = coordinators.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedCoordinators as any);
  }
}