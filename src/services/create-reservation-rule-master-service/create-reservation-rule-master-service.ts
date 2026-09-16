import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ReservationRuleMasterModel } from "@/models/reservation-rule-master-model";
import { ReservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

type Props = {
  reservationRuleMasterRepository: ReservationRuleMasterRepository;
};

type Input = {
  id?: string;               // Database Primary Key (Edit mode me hi aayega)
  slotDuration: number;       // User Input Code (e.g. "APT-101")
  maxGuest: number;
  lateArrival: number;
  venueId: string;
  isActive?: boolean;
};

export class CreateReservationRuleMasterService {
  protected _reservationRuleMasterRepository: ReservationRuleMasterRepository;

  public constructor(props: Props) {
    this._reservationRuleMasterRepository = props.reservationRuleMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._reservationRuleMasterRepository.get(input.id);
      if (existing) {
        existing.venueId = input.venueId || existing.venueId;
        existing.slotDuration = input.slotDuration || existing.slotDuration;
        existing.maxGuest = input.maxGuest || existing.maxGuest;
        existing.lateArrival = input.lateArrival || existing.lateArrival;
        existing.isActive = isActive;

        await this._reservationRuleMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'RSR' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("RSR");

    const reservationRuleModel = ReservationRuleMasterModel.make({
      id: primaryKeyId,              // Database Primary Key -> <RSR>-12345
      slotDuration: input.slotDuration, // User Input -> APT-101
      venueId: input.venueId,
      maxGuest: input.maxGuest,
      lateArrival: input.lateArrival,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = reservationRuleModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = reservationRuleModel.getRecord();
    await this._reservationRuleMasterRepository.Create(record as any);

    return Result.ok(reservationRuleModel.get("id"));
  }
}