import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { signInService } from "@/services/sign-in-service";
import { getSessionService } from "@/services/get-session-service";
import { signOutService } from "@/services/sign-out-service";
import { sendOtpService } from "@/services/send-otp-service";
import { sendStaffOtpService } from "@/services/send-staff-otp-service";
import { checkOtpService } from "@/services/check-otp-service";
import { checkStaffOtpService } from "@/services/check-staff-otp-service";
import { setPasswordService } from "@/services/set-password-service";
import { setStaffPasswordService } from "@/services/set-staff-password-service";
import { getSmsService } from "@/services/get-sms-service";

// eslint-disable-next-line new-cap
export const authRouter = express.Router();

authRouter.post("/sign-in", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await signInService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.get("/get-session/:sessionId", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSessionService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.post("/sign-out", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await signOutService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.post("/send-otp", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);

    const result = await sendOtpService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.post("/send-staff-otp", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await sendStaffOtpService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.post("/check-otp", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await checkOtpService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.post("/check-staff-otp", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await checkStaffOtpService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.post("/set-password", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await setPasswordService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.post("/set-staff-password", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await setStaffPasswordService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

authRouter.get("/sms", async (request, response, next) => {
  try {
    const result = await getSmsService.execute();
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
