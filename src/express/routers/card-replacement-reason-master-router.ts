import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getCardReplacementReasonMasterService } from "@/services/get-card-replacement-reason-master-service";
import { getSingleCardReplacementReasonMasterService } from "@/services/get-single-card-replacement-reason-master-service";
import { createCardReplacementReasonMasterService } from "@/services/create-card-replacement-reason-master-service";
import { updateCardReplacementReasonMasterService } from "@/services/update-card-replacement-reason-master-service";

import { deleteCardReplacementReasonMasterService } from "@/services/delete-card-replacement-reason-master-service";

export const cardReplacementReasonMasterRouter = express.Router();

cardReplacementReasonMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCardReplacementReasonMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

cardReplacementReasonMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleCardReplacementReasonMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

cardReplacementReasonMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createCardReplacementReasonMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

cardReplacementReasonMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCardReplacementReasonMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

cardReplacementReasonMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCardReplacementReasonMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

cardReplacementReasonMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteCardReplacementReasonMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
