import {SetStaffPasswordService} from './set-staff-password-service';

import {userRepository} from '@/repositories/user-repository';
import {otpRepository} from '@/repositories/otp-repository';

export const setStaffPasswordService = new SetStaffPasswordService({
  userRepository,
  otpRepository,
});

export * from './set-staff-password-service';
