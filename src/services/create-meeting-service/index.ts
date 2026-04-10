import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {CreateMeetingService} from './create-meeting-service';

import {meetingRepository} from '@/repositories/meeting-repository';
import {userRepository} from '@/repositories/user-repository';

export const createMeetingService = new AccessMediatorService({
  getSessionService,
  service: new CreateMeetingService({
    meetingRepository,
    userRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './create-meeting-service';
