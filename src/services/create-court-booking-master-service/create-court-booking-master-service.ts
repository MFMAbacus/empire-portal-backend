import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { CourtBookingMasterModel } from "@/models/court-booking-master-model";
import { CourtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

type Props = {
  courtBookingMasterRepository: CourtBookingMasterRepository;
};

type Input = {
  id?: string;  
  maxBooking: number;
  advanceBooking: number;
  projectCode: string;
  pendingSlot?: boolean;
  isActive?: boolean;
};

export class CreateCourtBookingMasterService {
  protected _courtBookingMasterRepository: CourtBookingMasterRepository;

  public constructor(props: Props) {
    this._courtBookingMasterRepository = props.courtBookingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const isPending = typeof input.pendingSlot !== "undefined" ? Boolean(input.pendingSlot) : true;
    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._courtBookingMasterRepository.get(input.id);
      if (existing) {
        existing.maxBooking = input.maxBooking || existing.maxBooking;
        existing.advanceBooking = input.advanceBooking || existing.advanceBooking;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.isActive = isActive;
        existing.pendingSlot = isPending;

        await this._courtBookingMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("BR");


    const courtBookingModel = CourtBookingMasterModel.make({
      id: primaryKeyId,
      maxBooking: input.maxBooking,
      advanceBooking: input.advanceBooking,
      projectCode: input.projectCode,
      pendingSlot: isPending,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = courtBookingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = courtBookingModel.getRecord();
    await this._courtBookingMasterRepository.Create(record as any);

    return Result.ok(courtBookingModel.get("id"));
  }
}