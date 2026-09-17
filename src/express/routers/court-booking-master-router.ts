import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getCourtBookingMasterService } from "@/services/get-court-booking-master-service";
import { getSingleCourtBookingMasterService } from "@/services/get-single-court-booking-master-service";
import { createCourtBookingMasterService } from "@/services/create-court-booking-master-service";
import { updateCourtBookingMasterService } from "@/services/update-court-booking-master-service";

import { deleteCourtBookingMasterService } from "@/services/delete-court-booking-master-service";

export const courtBookingMasterRouter = express.Router();

courtBookingMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCourtBookingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBookingMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleCourtBookingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBookingMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createCourtBookingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBookingMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCourtBookingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBookingMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCourtBookingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

courtBookingMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteCourtBookingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
