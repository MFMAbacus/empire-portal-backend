import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ProjectCourtMasterRepository } from "@/repositories/project-court-master-repository";

type Props = {
  projectCourtMasterRepository: ProjectCourtMasterRepository;
};

type Input = {
  id?: string;
  isRestore?: boolean | string;
};

export class DeleteProjectCourtMasterService {
  protected _projectCourtMasterRepository: ProjectCourtMasterRepository;

  public constructor(props: Props) {
    this._projectCourtMasterRepository = props.projectCourtMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._projectCourtMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._projectCourtMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
