import {AccessMediatorService} from '@/services/access-mediator-service';
import {DeleteAnnouncementService} from './delete-announcement-service';

import {getSessionService} from '@/services/get-session-service';
import {announcementRepository} from '@/repositories/announcement-repository';

export const deleteAnnouncementService = new AccessMediatorService({
  getSessionService,
  service: new DeleteAnnouncementService({
    announcementRepository,
  }),
  roles: [
    'manager',
    'customer',
  ],
});

export * from './delete-announcement-service';
