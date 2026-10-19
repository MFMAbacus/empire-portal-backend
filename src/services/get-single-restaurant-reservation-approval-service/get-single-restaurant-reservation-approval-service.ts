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

  public async execute(input: any): Promise<Result<any, Failure>> {
    try {
      const id = typeof input === "string" ? input : (input?.requestId || input?.reservationNo || input?.id);
      if (!id) return Result.fail(Failure.badRequest("requestId is required"));
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
