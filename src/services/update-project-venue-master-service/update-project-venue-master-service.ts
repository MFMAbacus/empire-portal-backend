import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ProjectVenueMasterModel } from "@/models/project-venue-master-model";
import { ProjectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

type Props = {
  projectVenueMasterRepository: ProjectVenueMasterRepository;
};

type Input = {
  id?: string;    
  venueId?: string;
  projectCode?: string;
  isAccess?: boolean;
  isActive?: boolean;
};

export class UpdateProjectVenueMasterService {
  protected _projectVenueMasterRepository: ProjectVenueMasterRepository;

  public constructor(props: Props) {
    this._projectVenueMasterRepository = props.projectVenueMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to projectVenueId
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._projectVenueMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;
    const isAccess =
      typeof input.isAccess !== "undefined"
        ? Boolean(input.isAccess)
        : record.isAccess;

    // Model me projectVenue fields map aur validate kar rahe hain (naya input ya purana fallback)
    const projectVenueModel = ProjectVenueMasterModel.make({
      id: targetId,
      venueId: input.venueId || record.venueId,
      projectCode: input.projectCode || record.projectCode,
      isAccess: isAccess,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = projectVenueModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = projectVenueModel.getRecord();
    await this._projectVenueMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}