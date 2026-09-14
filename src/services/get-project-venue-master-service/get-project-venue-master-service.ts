import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IProjectVenueMaster } from "@/schemas/project-venue-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ProjectVenueMasterRepository } from "@/repositories/project-venue-master-repository";

type Props = {
  projectVenueMasterRepository: ProjectVenueMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetProjectVenueMasterService {
  protected _projectVenueMasterRepository: ProjectVenueMasterRepository;

  public constructor(props: Props) {
    this._projectVenueMasterRepository = props.projectVenueMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IProjectVenueMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._projectVenueMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
