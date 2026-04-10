import express from "express";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";
// eslint-disable-next-line max-len
import { createPaymentService } from "@/services/fastpay-payment-service";
import { fastpayIpnService } from "@/services/fastpay-ipn-service";
// eslint-disable-next-line new-cap

export const fastPayRouter = express.Router();

fastPayRouter.post("/ipn", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await fastpayIpnService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

fastPayRouter.post("/paymentInitiate", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createPaymentService.execute(input);
    return presentResult(result, response);
  } catch (error) {
    next(error);
  }
});
