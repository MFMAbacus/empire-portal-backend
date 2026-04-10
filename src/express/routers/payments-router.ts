import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getPaymentsService } from "@/services/get-payments-service";
import { createPaymentService } from "@/services/create-payment-service";
import { confirmPaymentService } from "@/services/confirm-payment-service";
import { paymentConfirmService } from "@/services/payment-confim-service";
import { postPaymentToSap } from "@/services/sap-posting";
// eslint-disable-next-line new-cap
export const paymentsRouter = express.Router();

paymentsRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getPaymentsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

paymentsRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createPaymentService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

paymentsRouter.post(
  "/confirmStatus/:paymentId",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await paymentConfirmService.execute(input);
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

paymentsRouter.post("/:id/confirm", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await confirmPaymentService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

paymentsRouter.post("postToSap/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await postPaymentToSap.execute(input);
    return presentResult(result, response);
  } catch (error) {
    next(error);
  }
});
