import { OtpRepository } from "./otp-repository";
import { OtpRepositoryDb } from "./otp-repository-db";

export const otpRepository: OtpRepository = (() => {
  return new OtpRepositoryDb();
})();

export * from "./otp-repository";
export * from "./otp-repository-db";
