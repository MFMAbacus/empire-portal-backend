import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getPropertyManagementApprovalMasterService } from "@/services/get-property-managemnt-approval-master-service";
import { getSinglePropertyManagementApprovalMasterService } from "@/services/get-single-property-management-approval-master-service";
import { createPropertyManagementApprovalMasterService } from "@/services/create-property-management-approval-master-service";
import { updatePropertyManagementApprovalMasterService } from "@/services/update-property-management-approval-master-service";

import { deletePropertyManagementApprovalMasterService } from "@/services/delete-property-management-approval-master-service";

export const propertyManagementApprovalMasterRouter = express.Router();

propertyManagementApprovalMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getPropertyManagementApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyManagementApprovalMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSinglePropertyManagementApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyManagementApprovalMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createPropertyManagementApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyManagementApprovalMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updatePropertyManagementApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyManagementApprovalMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updatePropertyManagementApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

propertyManagementApprovalMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deletePropertyManagementApprovalMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
