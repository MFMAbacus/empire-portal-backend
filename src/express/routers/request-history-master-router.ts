import express from "express";
import { presentResult } from "@/express/present-result";
import { Result } from "@/utility/result";

export const requestHistoryMasterRouter = express.Router();

requestHistoryMasterRouter.get("/", async (request, response, next) => {
  try {
    return presentResult(Result.ok([]), response);
  } catch (error: unknown) {
    next(error);
  }
});
