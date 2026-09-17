import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CourtBookingMasterModel } from "@/models/court-booking-master-model";
import { CourtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

type Props = {
  courtBookingMasterRepository: CourtBookingMasterRepository;
};

type Input = {
  id?: string;    
  maxBooking?: number;
  advanceBooking?: number;
  projectCode?: string;
  pendingSlot?: boolean;
  isActive?: boolean;
};

export class UpdateCourtBookingMasterService {
  protected _courtBookingMasterRepository: CourtBookingMasterRepository;

  public constructor(props: Props) {
    this._courtBookingMasterRepository = props.courtBookingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to courtBookingId
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._courtBookingMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;
    const isPending =
      typeof input.pendingSlot !== "undefined"
        ? Boolean(input.pendingSlot)
        : record.pendingSlot;

    // Model me courtBooking fields map aur validate kar rahe hain (naya input ya purana fallback)
    const courtBookingModel = CourtBookingMasterModel.make({
      id: targetId,
      maxBooking: input.maxBooking || record.maxBooking,
      advanceBooking: input.advanceBooking || record.advanceBooking,
      projectCode: input.projectCode || record.projectCode,
      pendingSlot: isPending,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = courtBookingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = courtBookingModel.getRecord();
    await this._courtBookingMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}