import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { UserRepository } from "@/repositories/user-repository";

type Props = {
  userRepository: UserRepository;
};

type Input = {
  id: string;
  isRestore?: boolean;
};

export class DeleteUserService {
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const id = Attribute.make(input.id);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const userRecord = await this._userRepository.get(id.get());
    if (typeof userRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    userRecord.isArchived = !input.isRestore;
    userRecord.isCachier = false;
    await this._userRepository.Update(userRecord);

    return Result.ok(id.get());
  }
}
