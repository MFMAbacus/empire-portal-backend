import {CheckStaffOtpService} from './check-staff-otp-service';

import {otpRepository} from '@/repositories/otp-repository';

export const checkStaffOtpService = new CheckStaffOtpService({
  otpRepository,
});

export * from './check-staff-otp-service';
