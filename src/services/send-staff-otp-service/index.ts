import {SendStaffOtpService} from './send-staff-otp-service';

import {userRepository} from '@/repositories/user-repository';
import {otpRepository} from '@/repositories/otp-repository';

import {sendSmsService} from '@/services/send-sms-service';

export const sendStaffOtpService = new SendStaffOtpService({
  userRepository,
  otpRepository,
  sendSmsService,
});

export * from './send-staff-otp-service';
