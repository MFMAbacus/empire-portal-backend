import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getSecurityCoordinatorMasterService } from "@/services/get-security-coordinator-master-service";
import { getSingleSecurityCoordinatorMasterService } from "@/services/get-single-security-coordinator-master-service";
import { createSecurityCoordinatorMasterService } from "@/services/create-security-coordinator-master-service";
import { updateSecurityCoordinatorMasterService } from "@/services/update-security-coordinator-master-service";

import { deleteSecurityCoordinatorMasterService } from "@/services/delete-security-coordinator-master-service";

export const securityCoordinatorMasterRouter = express.Router();

securityCoordinatorMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSecurityCoordinatorMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

securityCoordinatorMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleSecurityCoordinatorMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

securityCoordinatorMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createSecurityCoordinatorMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

securityCoordinatorMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateSecurityCoordinatorMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

securityCoordinatorMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateSecurityCoordinatorMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

securityCoordinatorMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteSecurityCoordinatorMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
