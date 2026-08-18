import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";
import { DateTime } from "@/utility/date-time";

import { SessionRecord } from "@/records/session-record";
import { MeetingRepository } from "@/repositories/meeting-repository";

type Props = {
  meetingRepository: MeetingRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  id: string;
};

export class RefuseMeetingService {
  protected _meetingRepository: MeetingRepository;

  public constructor(props: Props) {
    this._meetingRepository = props.meetingRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const meetingRecord = await this._meetingRepository.get(id.get());
    if (typeof meetingRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const invite = meetingRecord.invitation.find((current) => {
      return current.staffId === input.sessionRecord.userId;
    });
    if (typeof invite === "undefined") {
      return Result.fail(Failure.notFound());
    }

    invite.status = "refused";
    const today = DateTime.now().toString().split(" ");
    invite.date = today[0];
    invite.time = today[1];

    await this._meetingRepository.updateInvitation(invite);

    return Result.ok(undefined);
  }
}
