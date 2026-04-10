import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetMeetingInvitesService } from "./get-meeting-invites-service";

import { getSessionService } from "@/services/get-session-service";
import { meetingRepository } from "@/repositories/meeting-repository";

export const getMeetingInvitesService = new AccessMediatorService({
  getSessionService,
  service: new GetMeetingInvitesService({
    meetingRepository,
  }),
  roles: ["manager", "staff"],
});

export * from "./get-meeting-invites-service";
