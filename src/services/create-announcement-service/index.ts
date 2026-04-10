import { AccessMediatorService } from "@/services/access-mediator-service";
import { CreateAnnouncementService } from "./create-announcement-service";

import { getSessionService } from "@/services/get-session-service";
import { announcementRepository } from "@/repositories/announcement-repository";

export const createAnnouncementService = new AccessMediatorService({
  getSessionService,
  service: new CreateAnnouncementService({
    announcementRepository,
  }),
  roles: ["manager"],
});

export * from "./create-announcement-service";
