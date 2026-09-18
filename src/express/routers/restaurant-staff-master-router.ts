import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getRestaurantStaffMasterService } from "@/services/get-restaurant-staff-master-service";
import { getSingleRestaurantStaffMasterService } from "@/services/get-single-restaurant-staff-master-service";
import { createRestaurantStaffMasterService } from "@/services/create-restaurant-staff-master-service";
import { updateRestaurantStaffMasterService } from "@/services/update-restaurant-staff-master-service";

import { deleteRestaurantStaffMasterService } from "@/services/delete-restaurant-staff-master-service";

export const restaurantStaffMasterRouter = express.Router();

restaurantStaffMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getRestaurantStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

restaurantStaffMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleRestaurantStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

restaurantStaffMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createRestaurantStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

restaurantStaffMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateRestaurantStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

restaurantStaffMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateRestaurantStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

restaurantStaffMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteRestaurantStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
