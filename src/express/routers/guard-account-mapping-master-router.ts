import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getGuardAccountMappingMasterService } from "@/services/get-guard-account-mapping-master-service";
import { getSingleGuardAccountMappingMasterService } from "@/services/get-single-guard-account-mapping-master-service";
import { createGuardAccountMappingMasterService } from "@/services/create-guard-account-mapping-master-service";
import { updateGuardAccountMappingMasterService } from "@/services/update-guard-account-mapping-master-service";

import { deleteGuardAccountMappingMasterService } from "@/services/delete-guard-account-mapping-master-service";

export const guardAccountMappingMasterRouter = express.Router();

guardAccountMappingMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getGuardAccountMappingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

guardAccountMappingMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleGuardAccountMappingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

guardAccountMappingMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createGuardAccountMappingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

guardAccountMappingMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateGuardAccountMappingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

guardAccountMappingMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateGuardAccountMappingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

guardAccountMappingMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteGuardAccountMappingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
