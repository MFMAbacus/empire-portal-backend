import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getFacilityApprovalMasterService } from "@/services/get-facility-approval-master-service";
import { getSingleFacilityApprovalMasterService } from "@/services/get-single-facility-approval-master-service";
import { createFacilityApprovalMasterService } from "@/services/create-facility-approval-master-service";
import { updateFacilityApprovalMasterService } from "@/services/update-facility-approval-master-service";

import { deleteFacilityApprovalMasterService } from "@/services/delete-facility-approval-master-service";

export const facilityApprovalMasterRouter = express.Router();

facilityApprovalMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getFacilityApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

facilityApprovalMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleFacilityApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

facilityApprovalMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createFacilityApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

facilityApprovalMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateFacilityApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

facilityApprovalMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateFacilityApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

facilityApprovalMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteFacilityApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
