import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { VenueOperatingMasterModel } from "@/models/venue-operating-master-model";
import { VenueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

type Props = {
  venueOperatingMasterRepository: VenueOperatingMasterRepository;
};

type Input = {
  id?: string;    
  venueId?: string;
  day?: string;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
  isActive?: boolean;
};

export class UpdateVenueOperatingMasterService {
  protected _venueOperatingMasterRepository: VenueOperatingMasterRepository;

  public constructor(props: Props) {
    this._venueOperatingMasterRepository = props.venueOperatingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to venueOperatingId
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._venueOperatingMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;
    const isClosed =
      typeof input.isClosed !== "undefined"
        ? Boolean(input.isClosed)
        : record.isClosed;

    // Model me venueOperating fields map aur validate kar rahe hain (naya input ya purana fallback)
    const venueOperatingModel = VenueOperatingMasterModel.make({
      id: targetId,
      venueId: input.venueId || record.venueId,
      day: input.day || record.day,
      openTime: input.openTime || record.openTime,
      closeTime: input.closeTime || record.closeTime,
      isClosed: isClosed,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = venueOperatingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = venueOperatingModel.getRecord();
    await this._venueOperatingMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}