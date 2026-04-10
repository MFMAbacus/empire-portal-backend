import {SendOtpService} from './send-otp-service';

import {customerRepository} from '@/repositories/customer-repository';
import {otpRepository} from '@/repositories/otp-repository';

import {sendSmsService} from '@/services/send-sms-service';

export const sendOtpService = new SendOtpService({
  customerRepository,
  otpRepository,
  sendSmsService,
});

export * from './send-otp-service';
