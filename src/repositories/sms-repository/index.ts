import { SmsRepository } from "./sms-repository";
import { SmsRepositoryDb } from "./sms-repository-db";

export const smsRepository: SmsRepository = new SmsRepositoryDb();

export * from "./sms-repository";
export * from "./sms-repository-db";
