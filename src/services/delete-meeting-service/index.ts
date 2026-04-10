import {AccessMediatorService} from '@/services/access-mediator-service';
import {DeleteMeetingService} from './delete-meeting-service';

import {getSessionService} from '@/services/get-session-service';
import {meetingRepository} from '@/repositories/meeting-repository';

export const deleteMeetingService = new AccessMediatorService({
  getSessionService,
  service: new DeleteMeetingService({
    meetingRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './delete-meeting-service';
