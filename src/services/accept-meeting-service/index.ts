import { AccessMediatorService } from "@/services/access-mediator-service";
import { getSessionService } from "@/services/get-session-service";
import { AcceptMeetingService } from "./accept-meeting-service";

import { meetingRepository } from "@/repositories/meeting-repository";

export const acceptMeetingService = new AccessMediatorService({
  getSessionService,
  service: new AcceptMeetingService({
    meetingRepository,
  }),
  roles: ["staff", "manager"],
});

export * from "./accept-meeting-service";
