import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getPropertyMasterService } from "@/services/get-property-master-service";
import { getSinglePropertyMasterService } from "@/services/get-single-property-master-service";
import { createPropertyMasterService } from "@/services/create-property-master-service";
import { updatePropertyMasterService } from "@/services/update-property-master-service";
import { deletePropertyMasterService } from "@/services/delete-property-master-service";
import PropertyMaster from "@/schemas/property-master-schema";

export const propertyMasterRouter = express.Router();

propertyMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getPropertyMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// MOBILE API
propertyMasterRouter.get("/mobile/property-master", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await PropertyMaster.find({ isActive: true, isArchived: false })
    .select("id propertyName projectCode projectName")
    .lean();
    return response.json({ success: true, data: result });
  } catch (error: unknown) {
    next(error);
  }
});
propertyMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSinglePropertyMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createPropertyMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updatePropertyMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updatePropertyMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deletePropertyMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
