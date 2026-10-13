import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getMenuMasterService } from "@/services/get-menu-master-service";
import { getSingleMenuMasterService } from "@/services/get-single-menu-master-service";
import { createMenuMasterService } from "@/services/create-menu-master-service";
import { updateMenuMasterService } from "@/services/update-menu-master-service";

import { deleteMenuMasterService } from "@/services/delete-menu-master-service";
import MenuMaster from "@/schemas/menu-master-schema";

export const menuMasterRouter = express.Router();

menuMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getMenuMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// MOBILE API
menuMasterRouter.get("/mobile/menu-master/:id", async (request, response, next) => {
  try {
    const { id } = request.params;

    const result = await MenuMaster.find({ 
      venueId: id,
      isActive: true, 
      isArchived: false 
    })
      .select(
        "id menuId menuName price menuItem venueId ",
      )
      .lean();
    return response.json({ success: true, data: result });
  } catch (error: unknown) {
    next(error);
  }
});

menuMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleMenuMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

menuMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createMenuMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

menuMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateMenuMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

menuMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateMenuMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

menuMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteMenuMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
