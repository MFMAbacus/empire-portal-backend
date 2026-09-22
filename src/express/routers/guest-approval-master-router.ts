import express from "express";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";
import { Result } from "@/utility/result";

export const guestApprovalMasterRouter = express.Router();

// GET all guest approval requests
guestApprovalMasterRouter.get("/", async (request, response, next) => {
  try {
    return presentResult(Result.ok([]), response);
  } catch (error: unknown) {
    next(error);
  }
});

// POST new guest access request
guestApprovalMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);

    // TODO: Save input.body into MongoDB
    return presentResult(Result.ok(input.body), response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH / PUT update request
guestApprovalMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);

    // TODO: Update MongoDB record using id

    return presentResult(
      Result.ok({
        id,
        ...input.body,
      }),
      response,
    );
  } catch (error: unknown) {
    next(error);
  }
});