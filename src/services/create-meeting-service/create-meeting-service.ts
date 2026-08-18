import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ValidationRule } from "@/utility/validation-rule";
import { Validation } from "@/utility/validation";

import { SessionRecord } from "@/records/session-record";
import {
  MeetingImportance,
  MeetingInvitationRecord,
  MeetingRecord,
} from "@/records/meeting-record";
import { MeetingRepository } from "@/repositories/meeting-repository";
import { UserRepository } from "@/repositories/user-repository";
import { MeetingModel } from "@/models/meeting-model";

import { getTokensByUsersIds } from "@/data/clients-sessions";
import NotificationFCM from "@/utility/notification/notification";
import {
  IMeetingInvitationRecord,
  IMeetingRecord,
} from "@/schemas/meetings-schema";

type Props = {
  userRepository: UserRepository;
  meetingRepository: MeetingRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  subject: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  importance: MeetingImportance;
  agenda: string;
  invitation: {
    staffId: string;
    isRequired: boolean;
  }[];
};

export class CreateMeetingService {
  protected _userRepository: UserRepository;
  protected _meetingRepository: MeetingRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
    this._meetingRepository = props.meetingRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const meetingModel = MeetingModel.make({
      id: Generator.id("M"),
      subject: input.subject,
      date: input.date,
      time: input.time,
      duration: input.duration,
      location: input.location,
      importance: input.importance,
      agenda: input.agenda,
      invitation: [],
      isArchived: false,
    });

    const validationBag = meetingModel.validate();

    validationBag.set(
      "invitation",
      Validation.make(input.invitation).mandatory().array().getRule()
    );

    if (!validationBag.hasError("invitation")) {
      const invitation = input.invitation.map((invitation) => {
        return {
          staffId: invitation.staffId,
          staffName: "N/A",
          status: "pending",
          isRequired: invitation.isRequired,
          date: null,
          time: null,
        } as IMeetingInvitationRecord;
      });

      for (const [index, invite] of invitation.entries()) {
        validationBag.set(
          `invitation.${index}.staffId`,
          Validation.make(invite.staffId).mandatory().string().getRule()
        );
        validationBag.set(
          `invitation.${index}.isRequired`,
          Validation.make(invite.isRequired).mandatory().boolean().getRule()
        );
        if (!validationBag.hasError(`invitation.${index}.staffId`)) {
          const staffRecord = await this._userRepository.get(invite.staffId);

          if (typeof staffRecord === "undefined") {
            validationBag.set(
              `invitation.${index}.staffId`,
              ValidationRule.valueIsInvalid()
            );
          } else {
            invitation[
              index
            ].staffName = `${staffRecord.firstName} ${staffRecord.lastName}`;
          }
        }
      }

      meetingModel.set("invitation", invitation);
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const meetingRecord = meetingModel.getRecord<IMeetingRecord>();

    await this._meetingRepository.Create(meetingRecord);

    const staffIds = [];
    for (const invitation of meetingRecord.invitation) {
      staffIds.push(invitation.staffId);
    }

    if (staffIds.length !== 0) {
      const staffTokens = getTokensByUsersIds(staffIds);
      if (staffTokens.length > 0) {
        await NotificationFCM.getInstance().sendToMany(
          {
            messageId: Generator.id(),
            title: "Meeting Invitation",
            body: `Dear user,
    You have been invited to the meeting ${meetingRecord.id}.`,
            id: meetingRecord.id,
            type: "meeting",
          },
          staffTokens
        );
      }
    }

    return Result.ok(meetingModel.get("id"));
  }
}
