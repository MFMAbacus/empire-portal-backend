import {SetPasswordService} from './set-password-service';

import {customerRepository} from '@/repositories/customer-repository';
import {otpRepository} from '@/repositories/otp-repository';

export const setPasswordService = new SetPasswordService({
  customerRepository,
  otpRepository,
});

export * from './set-password-service';
