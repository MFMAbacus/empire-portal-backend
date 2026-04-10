import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

// eslint-disable-next-line max-len
import { getInvoicesPaymentsService } from "@/services/get-invoices-payments-service";
// eslint-disable-next-line max-len
import { createInvoicePaymentService } from "@/services/create-invoice-payment-service";
// eslint-disable-next-line max-len
import { confirmInvoicePaymentService } from "@/services/confirm-invoice-payment-service";

// eslint-disable-next-line new-cap
export const invoicesPaymentsRouter = express.Router();

invoicesPaymentsRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getInvoicesPaymentsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

invoicesPaymentsRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createInvoicePaymentService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

invoicesPaymentsRouter.post(
  "/:paymentId/confirm",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await confirmInvoicePaymentService.execute(input);
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);
