import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ProjectCourtMasterModel } from "@/models/project-court-master-model";
import { ProjectCourtMasterRepository } from "@/repositories/project-court-master-repository";

type Props = {
  projectCourtMasterRepository: ProjectCourtMasterRepository;
};

type Input = {
  id?: string;    
  courtId?: string;
  projectCode?: string;
  isAccess?: boolean;
  isActive?: boolean;
};

export class UpdateProjectCourtMasterService {
  protected _projectCourtMasterRepository: ProjectCourtMasterRepository;

  public constructor(props: Props) {
    this._projectCourtMasterRepository = props.projectCourtMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to projectCourtId
    const targetId = input.id;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._projectCourtMasterRepository.get(targetId);
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

    // Model me projectCourt fields map aur validate kar rahe hain (naya input ya purana fallback)
    const projectCourtModel = ProjectCourtMasterModel.make({
      id: targetId,
      courtId: input.courtId || record.courtId,
      projectCode: input.projectCode || record.projectCode,
      isAccess: isAccess,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = projectCourtModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = projectCourtModel.getRecord();
    await this._projectCourtMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}