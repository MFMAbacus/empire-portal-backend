import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { UserMasterRepository } from "@/repositories/user-master-repository";

type Props = {
  userMasterRepository: UserMasterRepository;
};

type Input = {
  id?: string;
  userId?: string;
  isRestore?: boolean | string;
};

export class DeleteUserMasterService {
  protected _userMasterRepository: UserMasterRepository;

  public constructor(props: Props) {
    this._userMasterRepository = props.userMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.userId || "";
    const id = Attribute.make(targetId);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const record = await this._userMasterRepository.get(id.get());
    if (typeof record === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const isRestore = input.isRestore === true || input.isRestore === "1" || input.isRestore === "true";
    record.isArchived = !isRestore;
    await this._userMasterRepository.Update(record);

    return Result.ok(id.get());
  }
}
