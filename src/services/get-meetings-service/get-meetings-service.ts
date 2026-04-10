import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {MeetingRecord} from '@/records/meeting-record';
import {MeetingRepository} from '@/repositories/meeting-repository';
import {SessionRecord} from '@/records/session-record';

type Props = {
  meetingRepository: MeetingRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  isArchived?: boolean;
};

export class GetMeetingsService {
  protected _meetingRepository: MeetingRepository;

  public constructor(props: Props) {
    this._meetingRepository = props.meetingRepository;
  }

  // eslint-disable-next-line max-len
  public async execute(input: Input): Promise<Result<MeetingRecord[], Failure>> {
    let meetingsRecords = await this._meetingRepository.getAll();

    meetingsRecords = meetingsRecords.filter((current) => {
      return current.isArchived === Boolean(input.isArchived);
    });

    if (input.sessionRecord.role === 'staff') {
      meetingsRecords = meetingsRecords.filter((record) => {
        return typeof record.invitation.find((invitation) => {
          return invitation.staffId === input.sessionRecord.userId;
        }) !== 'undefined';
      });
    }

    return Result.ok(meetingsRecords);
  }
}
