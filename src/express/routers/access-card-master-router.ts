import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getAccessCardMasterService } from "@/services/get-access-card-master-service";
import { getSingleAccessCardMasterService } from "@/services/get-single-access-card-master-service";
import { createAccessCardMasterService } from "@/services/create-access-card-master-service";
import { updateAccessCardMasterService } from "@/services/update-access-card-master-service";

import { deleteAccessCardMasterService } from "@/services/delete-access-card-master-service";
import AccessCardMaster from "@/schemas/access-card-master-schema";

export const accessCardMasterRouter = express.Router();

accessCardMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getAccessCardMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// MOBILE API
accessCardMasterRouter.get("/mobile/access-card/:residentId", async (request, response, next) => {
  try {
    const { residentId } = request.params; 

    const result = await AccessCardMaster.find({ residentId: residentId,isActive: true, isArchived: false })
    .select("id cardId serialNo maskedSerial issueDate cardStatus projectCode apartmentId residentId")
    .lean();

    return response.status(200).json({ success: true, data: result });
  } catch (error: unknown) {
    next(error);
  }
});

accessCardMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleAccessCardMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createAccessCardMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateAccessCardMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateAccessCardMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

accessCardMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteAccessCardMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
