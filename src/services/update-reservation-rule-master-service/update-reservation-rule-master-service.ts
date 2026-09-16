import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ReservationRuleMasterModel } from "@/models/reservation-rule-master-model";
import { ReservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

type Props = {
  reservationRuleMasterRepository: ReservationRuleMasterRepository;
};

type Input = {
  id?: string;             // Database primary key ID (e.g., "1")
  slotDuration: number;     // User Input Code (e.g., "APT-101")
  maxGuest: number;
  lateArrival: number;
  venueId: string;
  isActive?: boolean;
};

export class UpdateReservationRuleMasterService {
  protected _reservationRuleMasterRepository: ReservationRuleMasterRepository;

  public constructor(props: Props) {
    this._reservationRuleMasterRepository = props.reservationRuleMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user id
    const targetId = input.id ;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._reservationRuleMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const reservationRuleModel = ReservationRuleMasterModel.make({
      id: targetId,
      slotDuration: input.slotDuration || record.slotDuration,
      maxGuest: input.maxGuest || record.maxGuest,
      lateArrival: input.lateArrival || record.lateArrival,
      venueId: input.venueId || record.venueId,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = reservationRuleModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = reservationRuleModel.getRecord();
    await this._reservationRuleMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}