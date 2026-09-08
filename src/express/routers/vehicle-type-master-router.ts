import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getVehicleTypeMasterService } from "@/services/get-vehicle-type-master-service";
import { getSingleVehicleTypeMasterService } from "@/services/get-single-vehicle-type-master-service";
import { createVehicleTypeMasterService } from "@/services/create-vehicle-type-master-service";
import { updateVehicleTypeMasterService } from "@/services/update-vehicle-type-master-service";

import { deleteVehicleTypeMasterService } from "@/services/delete-vehicle-type-master-service";

export const vehicleTypeMasterRouter = express.Router();

vehicleTypeMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

vehicleTypeMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

vehicleTypeMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

vehicleTypeMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

vehicleTypeMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

vehicleTypeMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
