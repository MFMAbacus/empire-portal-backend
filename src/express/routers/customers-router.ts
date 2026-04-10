import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getCustomersService } from "@/services/get-customers-service";
import { getCustomerService } from "@/services/get-customer-service";
import { createCustomerService } from "@/services/create-customer-service";
import { updateCustomerService } from "@/services/update-customer-service";
import { deleteCustomerService } from "@/services/delete-customer-service";
import { inviteCustomerService } from "@/services/invite-customer-service";
import { blockCustomerService } from "@/services/block-customer-service";
import { unblockCustomerService } from "@/services/unblock-customer-service";
import { createVehcile } from "@/services/create-vehicle";
import { deleteVehcile } from "@/services/delete-vehicle";
import { updateVehcile } from "@/services/update-vehicle";
// eslint-disable-next-line max-len
import { changeCustomerPasswordService } from "@/services/change-customer-password";
import { deActivateCustomerService } from "@/services/deactivate-customer-service";
import { getSapCustomersService } from "@/services/get-sap-customers-service";
import { getCustomersByUnitService } from "@/services/get-customers-by-unit-service";
import { Result } from "@/utility/result";
import { SapCustomerRecord } from "@/records/sapCustomers-record";
import { Failure } from "@/utility/failure";

// eslint-disable-next-line new-cap
export const customersRouter = express.Router();

customersRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCustomersService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.post("/getsapCustomers", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSapCustomersService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.get("/by-unit", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCustomersByUnitService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// eslint-disable-next-line max-len
customersRouter.patch("/change-password", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await changeCustomerPasswordService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.post("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// for mobile app user to update the user record
customersRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.post("/deactivate/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deActivateCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.patch("/:id/invite", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await inviteCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.patch("/:id/block", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await blockCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

customersRouter.patch("/:id/unblock", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await unblockCustomerService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// eslint-disable-next-line max-len
customersRouter.post(
  "/:customerId/vehicles",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await createVehcile.execute(input);
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  },
);

// eslint-disable-next-line max-len
customersRouter.delete(
  "/:customerId/vehicles/:id",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await deleteVehcile.execute(input);
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  },
);

// eslint-disable-next-line max-len
customersRouter.patch(
  "/:customerId/vehicles/:id",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await updateVehcile.execute(input);
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  },
);
