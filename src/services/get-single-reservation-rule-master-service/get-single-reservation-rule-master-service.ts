import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IReservationRuleMaster } from "@/schemas/reservation-rule-master-schema";
import { ReservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

type Props = {
  reservationRuleMasterRepository: ReservationRuleMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleReservationRuleMasterService {
  protected _reservationRuleMasterRepository: ReservationRuleMasterRepository;

  public constructor(props: Props) {
    this._reservationRuleMasterRepository = props.reservationRuleMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IReservationRuleMaster, Failure>> {
    const property = await this._reservationRuleMasterRepository.get(input.id);
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
