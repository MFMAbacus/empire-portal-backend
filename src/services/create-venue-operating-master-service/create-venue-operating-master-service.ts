import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { VenueOperatingMasterModel } from "@/models/venue-operating-master-model";
import { VenueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

type Props = {
  venueOperatingMasterRepository: VenueOperatingMasterRepository;
};

type Input = {
  id?: string;  
  venueId: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
  isActive?: boolean;
};

export class CreateVenueOperatingMasterService {
  protected _venueOperatingMasterRepository: VenueOperatingMasterRepository;

  public constructor(props: Props) {
    this._venueOperatingMasterRepository = props.venueOperatingMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const isClosed = typeof input.isClosed !== "undefined" ? Boolean(input.isClosed) : true;
    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._venueOperatingMasterRepository.get(input.id);
      if (existing) {
        existing.venueId = input.venueId || existing.venueId;
        existing.day = input.day || existing.day;
        existing.openTime = input.openTime || existing.openTime;
        existing.closeTime = input.closeTime || existing.closeTime;
        existing.isActive = isActive;
        existing.isClosed = isClosed;

        await this._venueOperatingMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("PV");


    const venueOperatingModel = VenueOperatingMasterModel.make({
      id: primaryKeyId,
      venueId: input.venueId,
      day: input.day,
      openTime: input.openTime,
      closeTime: input.closeTime,
      isClosed: isClosed,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = venueOperatingModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = venueOperatingModel.getRecord();
    await this._venueOperatingMasterRepository.Create(record as any);

    return Result.ok(venueOperatingModel.get("id"));
  }
}