import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getApprovalRoutingMasterService } from "@/services/get-approval-routing-master-service";
import { getSingleApprovalRoutingMasterService } from "@/services/get-single-approval-routing-master-service";
import { createApprovalRoutingMasterService } from "@/services/create-approval-routing-master-service";
import { updateApprovalRoutingMasterService } from "@/services/update-approval-routing-master-service";

import { deleteApprovalRoutingMasterService } from "@/services/delete-approval-routing-master-service";

export const approvalRoutingMasterRouter = express.Router();

approvalRoutingMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getApprovalRoutingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

approvalRoutingMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleApprovalRoutingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

approvalRoutingMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createApprovalRoutingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

approvalRoutingMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateApprovalRoutingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

approvalRoutingMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateApprovalRoutingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

approvalRoutingMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteApprovalRoutingMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
