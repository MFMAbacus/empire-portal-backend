import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {UpdateMeetingService} from './update-meeting-service';

import {meetingRepository} from '@/repositories/meeting-repository';
import {userRepository} from '@/repositories/user-repository';

export const updateMeetingService = new AccessMediatorService({
  getSessionService,
  service: new UpdateMeetingService({
    meetingRepository,
    userRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './update-meeting-service';
