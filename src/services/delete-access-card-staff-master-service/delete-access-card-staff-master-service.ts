import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { AccessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

type Props = {
  accessCardStaffMasterRepository: AccessCardStaffMasterRepository;
};

type Input = {
  id?: string;
  isRestore?: boolean | string;
};

export class DeleteAccessCardStaffMasterService {
  protected _accessCardStaffMasterRepository: AccessCardStaffMasterRepository;

  public constructor(props: Props) {
    this._accessCardStaffMasterRepository = props.accessCardStaffMasterRepository;
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

    const record = await this._accessCardStaffMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._accessCardStaffMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}