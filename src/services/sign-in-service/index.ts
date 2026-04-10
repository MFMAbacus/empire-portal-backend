import {SignInService} from './sign-in-service';

import {userRepository} from '@/repositories/user-repository';
import {customerRepository} from '@/repositories/customer-repository';
import {sessionRepository} from '@/repositories/session-repository';

export const signInService = new SignInService({
  userRepository,
  customerRepository,
  sessionRepository,
});

export * from './sign-in-service';
