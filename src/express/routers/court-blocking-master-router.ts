import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getCourtBlockingMasterService } from "@/services/get-court-blocking-master-service";
import { getSingleCourtBlockingMasterService } from "@/services/get-single-court-blocking-master-service";
import { createCourtBlockingMasterService } from "@/services/create-court-blocking-master-service";
import { updateCourtBlockingMasterService } from "@/services/update-court-blocking-master-service";

import { deleteCourtBlockingMasterService } from "@/services/delete-court-blocking-master-service";

export const courtBlockingMasterRouter = express.Router();

courtBlockingMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCourtBlockingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBlockingMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleCourtBlockingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBlockingMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createCourtBlockingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBlockingMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCourtBlockingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBlockingMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCourtBlockingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBlockingMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteCourtBlockingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
