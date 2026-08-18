import { AccessMediatorService } from "@/services/access-mediator-service";
import { getSessionService } from "@/services/get-session-service";
import { RefuseMeetingService } from "./refuse-meeting-service";

import { meetingRepository } from "@/repositories/meeting-repository";

export const refuseMeetingService = new AccessMediatorService({
  getSessionService,
  service: new RefuseMeetingService({
    meetingRepository,
  }),
  roles: ["staff", "manager"],
});

export * from "./refuse-meeting-service";
