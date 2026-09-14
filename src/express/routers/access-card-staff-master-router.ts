import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getAccessCardStaffMasterService } from "@/services/get-access-card-staff-master-service";
import { getSingleAccessCardStaffMasterService } from "@/services/get-single-access-card-staff-master-service";
import { createAccessCardStaffMasterService } from "@/services/create-access-card-staff-master-service";
import { updateAccessCardStaffMasterService } from "@/services/update-access-card-staff-master-service";

import { deleteAccessCardStaffMasterService } from "@/services/delete-access-card-staff-master-service";

export const accessCardStaffMasterRouter = express.Router();

accessCardStaffMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getAccessCardStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardStaffMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleAccessCardStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardStaffMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createAccessCardStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardStaffMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateAccessCardStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardStaffMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateAccessCardStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardStaffMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteAccessCardStaffMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
