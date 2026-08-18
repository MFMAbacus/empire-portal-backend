import {AccessMediatorService} from '@/services/access-mediator-service';
import {GetMeetingsService} from './get-meetings-service';

import {getSessionService} from '@/services/get-session-service';
import {meetingRepository} from '@/repositories/meeting-repository';

export const getMeetingsService = new AccessMediatorService({
  getSessionService,
  service: new GetMeetingsService({
    meetingRepository,
  }),
  roles: [
    'manager',
    'staff',
  ],
});

export * from './get-meetings-service';
