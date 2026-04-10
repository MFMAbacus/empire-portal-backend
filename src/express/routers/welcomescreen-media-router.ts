import express from "express";
import busboy from "busboy";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";
import { createWelcomescreenMediaService } from "@/services/create-welcomescreen-media-service";
import { updateWelcomescreenMediaService } from "@/services/update-welcomescreen-media-service";
import { getWelcomescreenMediaService } from "@/services/get-welcomescreen-media-service";
import { getWelcomescreenMediaItemService } from "@/services/get-welcomescreen-media-item-service";
import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { getActiveWelcomescreenMediaService } from "@/services/get-active-welcomescreen-media-service";

export const welcomescreenMediaRouter = express.Router();

welcomescreenMediaRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getWelcomescreenMediaService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

welcomescreenMediaRouter.get(
  "/activeMedia",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await getActiveWelcomescreenMediaService.execute(input);
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

welcomescreenMediaRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getWelcomescreenMediaItemService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

welcomescreenMediaRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createWelcomescreenMediaService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

welcomescreenMediaRouter.patch("/:_id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateWelcomescreenMediaService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
