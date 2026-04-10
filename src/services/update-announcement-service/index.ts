import {AccessMediatorService} from '@/services/access-mediator-service';
import {UpdateAnnouncementService} from './update-announcement-service';

import {getSessionService} from '@/services/get-session-service';
import {announcementRepository} from '@/repositories/announcement-repository';

export const updateAnnouncementService = new AccessMediatorService({
  getSessionService,
  service: new UpdateAnnouncementService({
    announcementRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './update-announcement-service';
