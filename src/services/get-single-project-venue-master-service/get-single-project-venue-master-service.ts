import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IProjectVenueMaster } from "@/schemas/project-venue-master-schema";
import { ProjectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

type Props = {
  projectVenueMasterRepository: ProjectVenueMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleProjectVenueMasterService {
  protected _projectVenueMasterRepository: ProjectVenueMasterRepository;

  public constructor(props: Props) {
    this._projectVenueMasterRepository = props.projectVenueMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IProjectVenueMaster, Failure>> {
    const property = await this._projectVenueMasterRepository.get(input.id);
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
