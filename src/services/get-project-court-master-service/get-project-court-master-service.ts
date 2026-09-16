import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IProjectCourtMaster } from "@/schemas/project-court-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ProjectCourtMasterRepository } from "@/repositories/project-court-master-repository";

type Props = {
  projectCourtMasterRepository: ProjectCourtMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetProjectCourtMasterService {
  protected _projectCourtMasterRepository: ProjectCourtMasterRepository;

  public constructor(props: Props) {
    this._projectCourtMasterRepository = props.projectCourtMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IProjectCourtMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._projectCourtMasterRepository.getAll({ isArchived });

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
