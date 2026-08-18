import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { ISessionRecord } from "@/schemas/session-schema";
import { SessionRepository } from "@/repositories/session-repository";
import { UserRepository } from "@/repositories/user-repository";

type Props = {
  sessionRepository: SessionRepository;
  userRepository: UserRepository;
};

type Input = {
  sessionId: string;
};

export class GetSessionService {
  protected _sessionRepository: SessionRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._sessionRepository = props.sessionRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<ISessionRecord, Failure>> {
    const sessionId = Attribute.make(input.sessionId);

    const sessionIdRule = Validation.make(sessionId.get())
      .mandatory()
      .string()
      .getRule();
    if (sessionIdRule.isError()) {
      return Result.fail(Failure.unauthorized());
    }

    const sessionRecord = await this._sessionRepository.get(sessionId.get());
    if (typeof sessionRecord === "undefined") {
      return Result.fail(Failure.unauthorized());
    }

    const userRecord = await this._userRepository.get(sessionRecord.userId);
    if (typeof userRecord === "undefined" && sessionRecord.role === "manager") {
      return Result.fail(Failure.unauthorized());
    }

    if (userRecord?.permissions) {
      sessionRecord.permissions = userRecord.permissions;
    }

    return Result.ok(sessionRecord);
  }
}
