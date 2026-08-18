import {AccessMediatorService} from '@/services/access-mediator-service';
// eslint-disable-next-line max-len
import {ChangeStaffPasswordService} from './change-staff-password-service';

import {userRepository} from '@/repositories/user-repository';
import {getSessionService} from '@/services/get-session-service';

export const changeStaffPasswordService = new AccessMediatorService({
  getSessionService,
  service: new ChangeStaffPasswordService({
    userRepository,
  }),
  roles: [
    'staff',
  ],
});

export * from './change-staff-password-service';
