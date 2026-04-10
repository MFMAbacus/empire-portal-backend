import {SignOutService} from './sign-out-service';

import {sessionRepository} from '@/repositories/session-repository';

export const signOutService = new SignOutService({
  sessionRepository,
});

export * from './sign-out-service';
