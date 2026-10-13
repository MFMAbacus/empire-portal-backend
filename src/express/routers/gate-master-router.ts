import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getGateMasterService } from "@/services/get-gate-master-service";
import { getSingleGateMasterService } from "@/services/get-single-gate-master-service";
import { createGateMasterService } from "@/services/create-gate-master-service";
import { updateGateMasterService } from "@/services/update-gate-master-service";

import { deleteGateMasterService } from "@/services/delete-gate-master-service";
import GateMaster from "@/schemas/gate-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema/apartment-master-schema";

export const gateMasterRouter = express.Router();

gateMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getGateMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// MOBILE API
gateMasterRouter.get("/mobile/gate-master", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await GateMaster.find({ isActive: true, isArchived: false })
    .select("id gateId gateName location projectCode ")
    .lean();
    return response.json({ success: true, data: result });
  } catch (error: unknown) {
    next(error);
  }
});
gateMasterRouter.get("/mobile/gate-master/:id", async (request, response, next) => {
  try {
    const { id } = request.params; // Isme projectCode aayega

    const result = await GateMaster.find({ 
      projectCode: id,
      isActive: true, 
      isArchived: false 
    })
    .select("id gateId gateName location projectCode")
    .lean();

    return response.json({ success: true, data: result });
  } catch (error: unknown) {
    next(error);
  }
});

gateMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleGateMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

gateMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createGateMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

gateMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateGateMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

gateMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateGateMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

gateMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteGateMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
