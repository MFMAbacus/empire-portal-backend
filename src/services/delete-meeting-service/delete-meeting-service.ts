import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { MeetingRepository } from "@/repositories/meeting-repository";
import { SessionRecord } from "@/records/session-record";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

type Props = {
  meetingRepository: MeetingRepository;
};

type Input = {
  id: string;
  isRestore?: boolean;
  sessionRecord: SessionRecord;
};

export class DeleteMeetingService {
  protected _meetingRepository: MeetingRepository;

  public constructor(props: Props) {
    this._meetingRepository = props.meetingRepository;
  }

  // eslint-disable-next-line max-len
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

    meetingRecord.isArchived = !input.isRestore;
    await this._meetingRepository.Delete(meetingRecord);

    return Result.ok(undefined);
  }
}
