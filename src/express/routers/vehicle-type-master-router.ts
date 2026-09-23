import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getVehicleTypeMasterService } from "@/services/get-vehicle-type-master-service";
import { getSingleVehicleTypeMasterService } from "@/services/get-single-vehicle-type-master-service";
import { createVehicleTypeMasterService } from "@/services/create-vehicle-type-master-service";
import { updateVehicleTypeMasterService } from "@/services/update-vehicle-type-master-service";
import { deleteVehicleTypeMasterService } from "@/services/delete-vehicle-type-master-service";

// Vehicle Type Schema direct import for mobile endpoint
import VehicleTypeMaster from "@/schemas/vehicle-type-master-schema/vehicle-type-master-schema";

export const vehicleTypeMasterRouter = express.Router();

// GET ALL (Web Portal View)
vehicleTypeMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// 📱 MOBILE-SPECIFIC ENDPOINT (Must be defined BEFORE /:id route)
vehicleTypeMasterRouter.get("/mobile/vehicle-types", async (req, res, next) => {
  try {
    const vehicleTypes = await VehicleTypeMaster.find({
      isArchived: false,
    }).lean();

    const formattedData = vehicleTypes.map((item: any) => ({
      vehicleTypeId: item.id || item.vehicleTypeId || item._id,
      vehicleType: item.vehicleType,
      isActive: item.isActive ?? true,
    }));

    return res.status(200).json({
      success: true,
      code: "success",
      data: formattedData,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      code: "error",
      message: "Failed to fetch vehicle types for mobile app",
    });
  }
});

// GET SINGLE BY ID (Web Portal)
vehicleTypeMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// POST (Web Portal)
vehicleTypeMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH (Web Portal)
vehicleTypeMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// PUT (Web Portal)
vehicleTypeMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// DELETE (Web Portal)
vehicleTypeMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteVehicleTypeMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});