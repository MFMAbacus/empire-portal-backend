import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getQRConfigurationMasterService } from "@/services/get-qr-configuration-master-service";
import { getSingleQRConfigurationMasterService } from "@/services/get-single-qr-configuration-master-service";
import { createQRConfigurationMasterService } from "@/services/create-qr-configuration-master-service";
import { updateQRConfigurationMasterService } from "@/services/update-qr-configuration-master-service";
import { deleteQRConfigurationMasterService } from "@/services/delete-qr-configuration-master-service";

export const qrConfigurationMasterRouter = express.Router();

qrConfigurationMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getQRConfigurationMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

qrConfigurationMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleQRConfigurationMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

qrConfigurationMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createQRConfigurationMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

qrConfigurationMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateQRConfigurationMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

qrConfigurationMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateQRConfigurationMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

qrConfigurationMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteQRConfigurationMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});