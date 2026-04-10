import {GetSmsService} from './get-sms-service';

import {smsRepository} from '@/repositories/sms-repository';

export const getSmsService = new GetSmsService({
  smsRepository,
});

export * from './get-sms-service';
