import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ValidationRule } from "@/utility/validation-rule";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";
import { Generator } from "@/utility/generator";
import NotificationFCM from "@/utility/notification/notification";

import { SessionRecord } from "@/records/session-record";
import {
  MeetingImportance,
  MeetingInvitationRecord,
} from "@/records/meeting-record";
import { MeetingRepository } from "@/repositories/meeting-repository";
import { UserRepository } from "@/repositories/user-repository";
import { MeetingModel } from "@/models/meeting-model";

import { getTokensByUsersIds } from "@/data/clients-sessions";
import { IMeetingInvitationRecord } from "@/schemas/meetings-schema";

type Props = {
  userRepository: UserRepository;
  meetingRepository: MeetingRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  id: string;
  subject?: string;
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  importance?: MeetingImportance;
  agenda?: string;
  invitation?: {
    staffId: string;
    isRequired: boolean;
  }[];
};

export class UpdateMeetingService {
  protected _userRepository: UserRepository;
  protected _meetingRepository: MeetingRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
    this._meetingRepository = props.meetingRepository;
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

    const meetingRecord = await this._meetingRepository.get(id.get());

    if (typeof meetingRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const meetingModel = MeetingModel.make(meetingRecord);
    meetingModel.set("subject", input.subject);
    meetingModel.set("date", input.date);
    meetingModel.set("time", input.time);
    meetingModel.set("duration", input.duration);
    meetingModel.set("location", input.location);
    meetingModel.set("importance", input.importance);
    meetingModel.set("agenda", input.agenda);

    const validationBag = meetingModel.validate();

    if (typeof input.invitation !== "undefined") {
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
            if (
              typeof staffRecord === "undefined" ||
              !staffRecord.isMobileUser
            ) {
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
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._meetingRepository.Update(meetingModel.getRecord());

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
            title: "Meeting Invitation Updated",
            body: `Dear user,
    The meeting ${meetingRecord.id} you have been invited to has been updated.`,
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
