import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetAnnouncementsService} from './get-announcements-service';

import {getSessionService} from '@/services/get-session-service';
import {announcementRepository} from '@/repositories/announcement-repository';

export const getAnnouncementsService = new AccessMediatorService({
  getSessionService,
  service: new GetAnnouncementsService({
    announcementRepository,
  }),
  roles: [
    'manager',
    'customer',
    'staff',
  ],
});

export * from './get-announcements-service';
