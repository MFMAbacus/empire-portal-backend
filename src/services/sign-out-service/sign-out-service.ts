import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";

import { SessionRepository } from "@/repositories/session-repository";

type Props = {
  sessionRepository: SessionRepository;
};

type Input = {
  sessionId: string;
};

export class SignOutService {
  protected _sessionRepository: SessionRepository;

  public constructor(props: Props) {
    this._sessionRepository = props.sessionRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const sessionId = Attribute.make(input.sessionId);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "sessionId",
      Validation.make(sessionId.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._sessionRepository.Delete(sessionId.get());

    return Result.ok(undefined);
  }
}
