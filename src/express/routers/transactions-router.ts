import express from "express";

import { presentResult } from "@/express/present-result";
import { getAllTransactionsService } from "@/services/get-all-transactions-service";

export const transactionsRouter = express.Router();

transactionsRouter.get("/", async (request, response, next) => {
  try {
    const result = await getAllTransactionsService.execute();
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});