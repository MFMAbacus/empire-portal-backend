import { AccessMediatorService } from "@/services/access-mediator-service";
import { GetAnnouncementService } from "./get-announcement-service";

import { getSessionService } from "@/services/get-session-service";
import { announcementRepository } from "@/repositories/announcement-repository";

export const getAnnouncementService = new AccessMediatorService({
  getSessionService,
  service: new GetAnnouncementService({
    announcementRepository,
  }),
  roles: ["manager", "customer", "staff"],
});

export * from "./get-announcement-service";
