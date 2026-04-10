import {smsRepository} from '@/repositories/sms-repository';

import {SendSmsService} from './send-sms-service';

export const sendSmsService = new SendSmsService( {
  smsRepository,
});

export * from './send-sms-service';
