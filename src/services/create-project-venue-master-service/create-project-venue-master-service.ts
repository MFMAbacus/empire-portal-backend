import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ProjectVenueMasterModel } from "@/models/project-venue-master-model";
import { ProjectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

type Props = {
  projectVenueMasterRepository: ProjectVenueMasterRepository;
};

type Input = {
  id?: string;  
  venueId: string;
  projectCode: string;
  isAccess?: boolean;
  isActive?: boolean;
};

export class CreateProjectVenueMasterService {
  protected _projectVenueMasterRepository: ProjectVenueMasterRepository;

  public constructor(props: Props) {
    this._projectVenueMasterRepository = props.projectVenueMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const isAccess = typeof input.isAccess !== "undefined" ? Boolean(input.isAccess) : true;
    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._projectVenueMasterRepository.get(input.id);
      if (existing) {
        existing.venueId = input.venueId || existing.venueId;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.isActive = isActive;
        existing.isAccess = isAccess;

        await this._projectVenueMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("PV");


    const projectVenueModel = ProjectVenueMasterModel.make({
      id: primaryKeyId,
      venueId: input.venueId,
      projectCode: input.projectCode,
      isAccess: isAccess,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = projectVenueModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = projectVenueModel.getRecord();
    await this._projectVenueMasterRepository.Create(record as any);

    return Result.ok(projectVenueModel.get("id"));
  }
}