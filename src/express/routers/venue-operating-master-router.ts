import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getVenueOperatingMasterService } from "@/services/get-venue-operating-master-service";
import { getSingleVenueOperatingMasterService } from "@/services/get-single-venue-operating-master-service";
import { createVenueOperatingMasterService } from "@/services/create-venue-operating-master-service";
import { updateVenueOperatingMasterService } from "@/services/update-venue-operating-master-service";

import { deleteVenueOperatingMasterService } from "@/services/delete-venue-operating-master-service";

export const venueOperatingMasterRouter = express.Router();

venueOperatingMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getVenueOperatingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueOperatingMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleVenueOperatingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueOperatingMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createVenueOperatingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueOperatingMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVenueOperatingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueOperatingMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVenueOperatingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueOperatingMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteVenueOperatingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
