import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { VenueMasterModel } from "@/models/venue-master-model";
import { VenueMasterRepository } from "@/repositories/venue-master-repository";

type Props = {
  venueMasterRepository: VenueMasterRepository;
};

type Input = {
  id?: string;           // Database Primary Key (Edit mode me hi aayega)
  venueId: string;       // User Input Code (e.g. "VEN-001")
  venueName: string;
  type: string;
  projectCode: string;
  location: string;
  contact: string;
  description?: string;
  imageOrLogo?: string;
  isActive?: boolean;
};

export class CreateVenueMasterService {
  protected _venueMasterRepository: VenueMasterRepository;

  public constructor(props: Props) {
    this._venueMasterRepository = props.venueMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Sirf tab chalega jab DB ki primary key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._venueMasterRepository.get(input.id);
      if (existing) {
        existing.venueId = input.venueId || existing.venueId;
        existing.venueName = input.venueName || existing.venueName;
        existing.type = input.type || existing.type;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.location = input.location || existing.location;
        existing.contact = input.contact || existing.contact;
        existing.description = input.description ?? existing.description;
        existing.imageOrLogo = input.imageOrLogo ?? existing.imageOrLogo;
        existing.isActive = isActive;

        await this._venueMasterRepository.Update(existing);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Jab Naya Record banega tab DB ki primary key 'VM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("VM");

    const venueModel = VenueMasterModel.make({
      id: primaryKeyId,          // Database Primary Key -> VM-12345
      venueId: input.venueId,    // User Input Code -> VEN-001
      venueName: input.venueName,
      type: input.type,
      projectCode: input.projectCode,
      location: input.location,
      contact: input.contact,
      description: input.description,
      imageOrLogo: input.imageOrLogo,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = venueModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = venueModel.getRecord();
    await this._venueMasterRepository.Create(record as any);

    return Result.ok(venueModel.get("id"));
  }
}