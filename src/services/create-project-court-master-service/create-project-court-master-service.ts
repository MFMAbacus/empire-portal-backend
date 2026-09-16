import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ProjectCourtMasterModel } from "@/models/project-court-master-model";
import { ProjectCourtMasterRepository } from "@/repositories/project-court-master-repository";

type Props = {
  projectCourtMasterRepository: ProjectCourtMasterRepository;
};

type Input = {
  id?: string;  
  courtId: string;
  projectCode: string;
  isAccess?: boolean;
  isActive?: boolean;
};

export class CreateProjectCourtMasterService {
  protected _projectCourtMasterRepository: ProjectCourtMasterRepository;

  public constructor(props: Props) {
    this._projectCourtMasterRepository = props.projectCourtMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const isAccess = typeof input.isAccess !== "undefined" ? Boolean(input.isAccess) : true;
    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._projectCourtMasterRepository.get(input.id);
      if (existing) {
        existing.courtId = input.courtId || existing.courtId;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.isActive = isActive;
        existing.isAccess = isAccess;

        await this._projectCourtMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'RM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("PV");


    const projectCourtModel = ProjectCourtMasterModel.make({
      id: primaryKeyId,
      courtId: input.courtId,
      projectCode: input.projectCode,
      isAccess: isAccess,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = projectCourtModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = projectCourtModel.getRecord();
    await this._projectCourtMasterRepository.Create(record as any);

    return Result.ok(projectCourtModel.get("id"));
  }
}