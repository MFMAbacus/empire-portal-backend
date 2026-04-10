import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getMeetingService } from "@/services/get-meeting-service";
import { getMeetingsService } from "@/services/get-meetings-service";
import { createMeetingService } from "@/services/create-meeting-service";
import { deleteMeetingService } from "@/services/delete-meeting-service";
import { updateMeetingService } from "@/services/update-meeting-service";
import { acceptMeetingService } from "@/services/accept-meeting-service";
import { refuseMeetingService } from "@/services/refuse-meeting-service";
import { getMeetingInvitesService } from "@/services/get-meeting-invites-service";

// eslint-disable-next-line new-cap
export const meetingsRouter = express.Router();

meetingsRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getMeetingsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

meetingsRouter.get("/invites", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getMeetingInvitesService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

meetingsRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getMeetingService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

meetingsRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createMeetingService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

meetingsRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateMeetingService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

meetingsRouter.patch("/:id/accept", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await acceptMeetingService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

meetingsRouter.patch("/:id/refuse", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await refuseMeetingService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

meetingsRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteMeetingService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
