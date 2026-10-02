import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { RestaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";

type Props = {
  restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;
};

export class GetSingleRestaurantReservationApprovalService {
  protected _restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;

  public constructor(props: Props) {
    this._restaurantReservationApprovalRepository = props.restaurantReservationApprovalRepository;
  }

  public async execute(id: string): Promise<Result<any, Failure>> {
    try {
      const record = await this._restaurantReservationApprovalRepository.get(id);
      if (!record) {
        return Result.fail(Failure.notFound());
      }
      return Result.ok(record);
    } catch (error) {
      console.error("Error getting single restaurant reservation approval:", error);
      return Result.fail(Failure.badRequest("Failed to get restaurant reservation approval request"));
    }
  }
}

export const makeGetSingleRestaurantReservationApprovalService = (props: Props) =>
  new GetSingleRestaurantReservationApprovalService(props);
