import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getVenueMasterService } from "@/services/get-venue-master-service";
import { getSingleVenueMasterService } from "@/services/get-single-venue-master-service";
import { createVenueMasterService } from "@/services/create-venue-master-service";
import { updateVenueMasterService } from "@/services/update-venue-master-service";

import { deleteVenueMasterService } from "@/services/delete-venue-master-service";
import VenueMaster from "@/schemas/venue-master-schema";

export const venueMasterRouter = express.Router();

venueMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getVenueMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// MOBILE API
venueMasterRouter.get("/mobile/venue-master/:id", async (request, response, next) => {
  try {
    const { id } = request.params; // Isme projectCode aayega

    const result = await VenueMaster.find({ 
      projectCode: id, // projectCode se filter karein
      isActive: true, 
      isArchived: false 
    })
    .select("id venueId venueName type projectCode location contact description imageOrLogo")
    .lean();
              return response.json({ success: true, data: result });
            } catch (error: unknown) {
              next(error);
            }
});

venueMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleVenueMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createVenueMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVenueMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVenueMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

venueMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteVenueMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
