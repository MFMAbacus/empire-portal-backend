import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { IUserRecord } from "@/schemas/user-schema";
import { UserRepository } from "@/repositories/user-repository";
import { SessionRecord } from "@/records/session-record";

type Props = {
  userRepository: UserRepository;
};

type Input = {
  id: string;
  sessionRecord: SessionRecord;
};

export class GetUserService {
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<IUserRecord, Failure>> {
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

    if (input.sessionRecord.role !== "manager") {
      if (input.sessionRecord.userId !== userRecord.id) {
        return Result.fail(Failure.notFound());
      }
    }

    return Result.ok(userRecord);
  }
}
