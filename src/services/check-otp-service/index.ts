import {CheckOtpService} from './check-otp-service';

import {otpRepository} from '@/repositories/otp-repository';

export const checkOtpService = new CheckOtpService({
  otpRepository,
});

export * from './check-otp-service';
