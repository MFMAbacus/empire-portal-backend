import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getDeliverySLAMasterService } from "@/services/get-delivery-sla-master-service";
import { getSingleDeliverySLAMasterService } from "@/services/get-single-delivery-sla-master-service";
import { createDeliverySLAMasterService } from "@/services/create-delivery-sla-master-service";
import { updateDeliverySLAMasterService } from "@/services/update-delivery-sla-master-service";

import { deleteDeliverySLAMasterService } from "@/services/delete-delivery-sla-master-service";

export const deliverySLAMasterRouter = express.Router();

deliverySLAMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getDeliverySLAMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

deliverySLAMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleDeliverySLAMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

deliverySLAMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createDeliverySLAMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

deliverySLAMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateDeliverySLAMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

deliverySLAMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateDeliverySLAMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

deliverySLAMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteDeliverySLAMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
