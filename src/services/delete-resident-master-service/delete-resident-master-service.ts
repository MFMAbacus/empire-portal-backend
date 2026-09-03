import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ResidentMasterRepository } from "@/repositories/resident-master-repository";

type Props = {
  residentMasterRepository: ResidentMasterRepository;
};

type Input = {
  id?: string;
  residentId?: string;
  isRestore?: boolean | string;
};

export class DeleteResidentMasterService {
  protected _residentMasterRepository: ResidentMasterRepository;

  public constructor(props: Props) {
    this._residentMasterRepository = props.residentMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.residentId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._residentMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._residentMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
