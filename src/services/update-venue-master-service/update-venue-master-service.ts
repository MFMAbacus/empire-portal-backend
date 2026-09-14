import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { VenueMasterModel } from "@/models/venue-master-model";
import { VenueMasterRepository } from "@/repositories/venue-master-repository";

type Props = {
  venueMasterRepository: VenueMasterRepository;
};

type Input = {
  id?: string;           // Database Primary Key ID (e.g., "VM-12345")
  venueId: string;       // User Input Code (e.g., "VEN-001")
  venueName?: string;
  type?: string;
  projectCode?: string;
  location?: string;
  contact?: string;
  description?: string;
  imageOrLogo?: string;
  isActive?: boolean;
};

export class UpdateVenueMasterService {
  protected _venueMasterRepository: VenueMasterRepository;

  public constructor(props: Props) {
    this._venueMasterRepository = props.venueMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to user input venueId
    const targetId = input.id || input.venueId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    const record = await this._venueMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Re-construct & validate with Model before saving
    const venueModel = VenueMasterModel.make({
      id: targetId,
      venueId: input.venueId || record.venueId,
      venueName: input.venueName || record.venueName,
      type: input.type || record.type,
      projectCode: input.projectCode || record.projectCode,
      location: input.location || record.location,
      contact: input.contact || record.contact,
      description: input.description ?? record.description,
      imageOrLogo: input.imageOrLogo ?? record.imageOrLogo,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = venueModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = venueModel.getRecord();
    await this._venueMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}