import express from "express";

import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getMobileResidentMasterService, getResidentMasterService } from "@/services/get-resident-master-service";
import { getSingleResidentMasterService } from "@/services/get-single-resident-master-service";
import { createResidentMasterService } from "@/services/create-resident-master-service";
import { updateResidentMasterService } from "@/services/update-resident-master-service";
import { findResidentByCustomerCode } from "@/utility/customer-resident-helper";

import { deleteResidentMasterService } from "@/services/delete-resident-master-service";

export const residentMasterRouter = express.Router();

residentMasterRouter.get("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getResidentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});


// MOBILE API
residentMasterRouter.get("/mobile/resident-master", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getMobileResidentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// // MOBILE API: Check & Get Resident data by customerCode / customerId
// const handleGetResidentByCustomer = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
//   try {
//     const input = combineRequestInput(request);
//     const customerCode = (
//       request.params.customerCode ||
//       input.customerCode ||
//       input.customerId ||
//       input.userId ||
//       input.code ||
//       request.query.customerCode ||
//       request.query.customerId ||
//       request.query.userId
//     ) as string;

//     if (!customerCode || customerCode.trim() === "") {
//       return response.status(400).json({
//         success: false,
//         code: "bad-request",
//         message: "customerCode is required",
//       });
//     }

//     const resident = await findResidentByCustomerCode(customerCode);

//     if (!resident) {
//       return response.status(200).json({
//         success: true,
//         code: "success",
//         data: {
//           isResident: false,
//           customerCode,
//           resident: null,
//           message: "No resident record found for this customer.",
//         },
//       });
//     }

//     return response.status(200).json({
//       success: true,
//       code: "success",
//       data: {
//         isResident: true,
//         customerCode,
//         resident,
//       },
//     });
//   } catch (error: unknown) {
//     next(error);
//   }
// };

// residentMasterRouter.get("/mobile/customer", handleGetResidentByCustomer);

residentMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await getSingleResidentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

residentMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createResidentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

residentMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateResidentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

residentMasterRouter.put("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await updateResidentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

residentMasterRouter.delete("/:id", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await deleteResidentMasterService.execute(input);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});
