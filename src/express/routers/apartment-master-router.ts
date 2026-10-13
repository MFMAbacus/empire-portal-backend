import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getApartmentMasterService } from "@/services/get-apartment-master-service";
import { getSingleApartmentMasterService } from "@/services/get-single-apartment-master-service";
import { createApartmentMasterService } from "@/services/create-apartment-master-service";
import { updateApartmentMasterService } from "@/services/update-apartment-master-service";

import { deleteApartmentMasterService } from "@/services/delete-apartment-master-service";
import ApartmentMaster from "@/schemas/apartment-master-schema";

export const apartmentMasterRouter = express.Router();

apartmentMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getApartmentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// MOBILE API
apartmentMasterRouter.get("/mobile/apartment-master", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await ApartmentMaster.find({ isActive: true, isArchived: false })
    .select("id apartmentId apartmentNo buildingOrTower floor projectCode")
    .lean();
    return response.json({ success: true, data: result });
  } catch (error: unknown) {
    next(error);
  }
});

apartmentMasterRouter.get("/mobile/apartment-master/:id", async (request, response, next) => {
  try {
    const { id } = request.params;

    const result = await ApartmentMaster.find({ 
      projectCode: id,
      isActive: true, 
      isArchived: false 
    })
    .select("id apartmentId apartmentNo buildingOrTower floor projectCode")
    .lean();

    return response.json({ success: true, data: result });
  } catch (error: unknown) {
    next(error);
  }
});

apartmentMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleApartmentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

apartmentMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createApartmentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

apartmentMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateApartmentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

apartmentMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateApartmentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

apartmentMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteApartmentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
