import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { assignRequestService } from "@/services/assign-request-service";
import { setRequestItemsService } from "@/services/set-request-items-service";
import { completeRequestService } from "@/services/complete-request-service";
import { getRequestsService } from "@/services/get-requests-service";
import { getRequestService } from "@/services/get-request-service";
import { createRequestService } from "@/services/create-request-service";
import { rateRequestService } from "@/services/rate-request-service";
import { approveRequestService } from "@/services/approve-request-service";
import { refuseRequestService } from "@/services/refuse-request-service";
import { setRequestPinService } from "@/services/set-request-pin-service";
import { deleteRequestService } from "@/services/delete-request-service";
import { deleteItemRequestService } from "@/services/delete-request-item-service";

// eslint-disable-next-line new-cap
export const requestsRouter = express.Router();

requestsRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getRequestsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.delete(
  "/:requestId/delete-item/:id",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await deleteItemRequestService.execute(input);
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

requestsRouter.post("/:id/approve", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await approveRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.post("/:id/set-pin", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await setRequestPinService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.post("/:id/refuse", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await refuseRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.post("/:id/rate", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await rateRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.post("/:id/assign", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await assignRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.post("/:id/set-items", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await setRequestItemsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

requestsRouter.post("/:id/complete", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await completeRequestService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
