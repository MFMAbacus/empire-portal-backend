import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetMeetingService} from './get-meeting-service';

import {getSessionService} from '@/services/get-session-service';
import {meetingRepository} from '@/repositories/meeting-repository';

export const getMeetingService = new AccessMediatorService({
  getSessionService,
  service: new GetMeetingService({
    meetingRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-meeting-service';
