import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getGeneralConfigurationsService } from "@/services/get-general-configurations";
import { getGeneralConfigurationService } from "@/services/get-general-configuration";
import { updateGeneralConfigurationService } from "@/services/update-general-configuration";

export const generalConfigurationsRouter = express.Router();

generalConfigurationsRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getGeneralConfigurationsService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

generalConfigurationsRouter.get(
  "/:configKey",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await getGeneralConfigurationService.execute({
        configKey: input.configKey as string,
      });
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);

generalConfigurationsRouter.put(
  "/:configKey",
  async (request, response, next) => {
    try {
      const input = combineRequestInput(request);
      const result = await updateGeneralConfigurationService.execute({
        configKey: input.configKey as string,
        updates: {
          commissionType: input.commissionType,
          commissionValue: input.commissionValue,
          validationValue: input.validationValue,
          isActive: input.isActive,
        },
      });
      return presentResult(result, response);
    } catch (error: unknown) {
      next(error);
    }
  }
);
