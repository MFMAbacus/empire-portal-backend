import express from "express";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";
import { Result } from "@/utility/result";

export const moveApprovalMasterRouter = express.Router();

// GET all move approval requests
moveApprovalMasterRouter.get("/", async (request, response, next) => {
  try {
    return presentResult(Result.ok([]), response);
  } catch (error: unknown) {
    next(error);
  }
});

// POST new move approval request
moveApprovalMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);

    // TODO: Save input.body to database

    return presentResult(Result.ok(input.body), response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH / update move approval request
moveApprovalMasterRouter.patch("/:id", async (request, response, next) => {
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