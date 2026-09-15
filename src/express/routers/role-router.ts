import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

 import { getUserRoleService } from "@/services/get-role-service";
// import { getSingleUserRoleService } from "@/services/get-single-role-service";
// import { createUserRoleService } from "@/services/create-role-service";
// import { updateUserRoleService } from "@/services/update-role-service";

// import { deleteUserRoleService } from "@/services/delete-role-service";

export const userRoleRouter = express.Router();

userRoleRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getUserRoleService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// userRoleRouter.get("/:id", async (request, response, next) => {
//   try {
//     const input = combineRequestInput(request);
//     const result = await getSingleUserRoleService.execute(input);
//     return presentResult(result, response);
//   } catch (error: unknown) {
//     next(error);
//   }
// });

// userRoleRouter.post("/", async (request, response, next) => {
//   try {
//     const input = combineRequestInput(request);
//     const result = await createUserRoleService.execute(input);
//     return presentResult(result, response);
//   } catch (error: unknown) {
//     next(error);
//   }
// });

// userRoleRouter.patch("/:id", async (request, response, next) => {
//   try {
//     const input = combineRequestInput(request);
//     const result = await updateUserRoleService.execute(input);
//     return presentResult(result, response);
//   } catch (error: unknown) {
//     next(error);
//   }
// });

// userRoleRouter.put("/:id", async (request, response, next) => {
//   try {
//     const input = combineRequestInput(request);
//     const result = await updateUserRoleService.execute(input);
//     return presentResult(result, response);
//   } catch (error: unknown) {
//     next(error);
//   }
// });

// userRoleRouter.delete("/:id", async (request, response, next) => {
//   try {
//     const input = combineRequestInput(request);
//     const result = await deleteUserRoleService.execute(input);
//     return presentResult(result, response);
//   } catch (error: unknown) {
//     next(error);
//   }
// });
