import express from "express";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";
import { Result } from "@/utility/result";

export const courtApprovalMasterRouter = express.Router();

// GET all court bookings
courtApprovalMasterRouter.get("/", async (request, response, next) => {
  try {
    return presentResult(Result.ok([]), response);
  } catch (error: unknown) {
    next(error);
  }
});

// POST new court booking
courtApprovalMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);

    // TODO: Save input.body to database

    return presentResult(Result.ok(input.body), response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH / update court booking
courtApprovalMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);

    // TODO: Update database record using id

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