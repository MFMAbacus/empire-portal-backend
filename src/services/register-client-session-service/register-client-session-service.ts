import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";

import { clientsSessions } from "@/data/clients-sessions";
import { SessionRecord } from "@/records/session-record";

type Input = {
  token: string;
  sessionRecord: SessionRecord;
};

export class RegisterClientSessionService {
  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const token = Attribute.make(input.token);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "token",
      Validation.make(token.get()).mandatory().string().getRule()
    );

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    clientsSessions.records = clientsSessions.records.filter((current) => {
      return current.token !== token.get();
    });

    clientsSessions.records.push({
      token: token.get(),
      userId: input.sessionRecord.userId,
      role: input.sessionRecord.role,
    });

    if (clientsSessions.records.length > 1000) {
      clientsSessions.records = [];
    }

    return Result.ok(undefined);
  }
}
