import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IProjectCourtMaster } from "@/schemas/project-court-master-schema";
import { ProjectCourtMasterRepository } from "@/repositories/project-court-master-repository";

type Props = {
  projectCourtMasterRepository: ProjectCourtMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleProjectCourtMasterService {
  protected _projectCourtMasterRepository: ProjectCourtMasterRepository;

  public constructor(props: Props) {
    this._projectCourtMasterRepository = props.projectCourtMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IProjectCourtMaster, Failure>> {
    const property = await this._projectCourtMasterRepository.get(input.id);
    if (!property) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (property as any).toObject === "function" ? (property as any).toObject() : { ...property };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}
