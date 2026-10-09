import express from "express";
import mongoose from "mongoose";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { makeGetCardProcessingMasterService } from "@/services/get-card-processing-master-service";
import { makeGetSingleCardProcessingMasterService } from "@/services/get-single-card-processing-master-service";
import { makeCreateCardProcessingMasterService } from "@/services/create-card-processing-master-service";
import { makeUpdateCardProcessingMasterService } from "@/services/update-card-processing-master-service";

import AccessCardMaster from "@/schemas/access-card-master-schema/access-card-master-schema";
import CardReplacementReasonMaster from "@/schemas/card-replacement-reason-master-schema/card-replacement-reason-master-schema";
import ReplacementFeeMaster from "@/schemas/replacement-fee-master-schema/replacement-fee-master-schema";
import DeliverySLAMaster from "@/schemas/delivery-sla-master-schema/delivery-sla-master-schema";
import AccessCardStaffMaster from "@/schemas/access-card-staff-master-schema/access-card-staff-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";
import CardProcessingMaster from "@/schemas/card-processing-master-schema/card-processing-master-schema";

export const cardProcessingMasterRouter = express.Router();

// ================================================================
// LOOKUP ROUTES (must come before /:id)
// ================================================================

// 1. Registered cards for resident (Mobile App display masked serial)
cardProcessingMasterRouter.get("/lookup/registered-cards/:residentId", async (req, res, next) => {
  try {
    const cards = await AccessCardMaster.find({
      residentId: req.params.residentId,
      isActive: true,
      isArchived: false,
    }).lean();
    return res.json({ success: true, data: cards });
  } catch (error) {
    next(error);
  }
});

// 2. Replacement reasons dropdown (Mobile App)
cardProcessingMasterRouter.get("/lookup/reasons", async (req, res, next) => {
  try {
    const reasons = await CardReplacementReasonMaster.find({
      isActive: true,
      isArchived: false,
    }).lean();
    return res.json({ success: true, data: reasons });
  } catch (error) {
    next(error);
  }
});

// 3. Replacement fee master by project (Mobile App fee calculation)
cardProcessingMasterRouter.get("/lookup/fee/:projectCode", async (req, res, next) => {
  try {
    const fee = await ReplacementFeeMaster.findOne({
      projectCode: req.params.projectCode,
      isActive: true,
      isArchived: false,
    }).lean();
    return res.json({ success: true, data: fee });
  } catch (error) {
    next(error);
  }
});

// 4. Delivery SLA Configuration by project
cardProcessingMasterRouter.get("/lookup/delivery-sla/:projectCode", async (req, res, next) => {
  try {
    const sla = await DeliverySLAMaster.findOne({
      projectCode: req.params.projectCode,
      isActive: true,
      isArchived: false,
    }).lean();
    return res.json({ success: true, data: sla });
  } catch (error) {
    next(error);
  }
});

// 5. Access Card Staff mapping by project (Routes processing to card staff)
cardProcessingMasterRouter.get("/lookup/staff/:projectCode", async (req, res, next) => {
  try {
    const staff = await AccessCardStaffMaster.find({
      projectCode: req.params.projectCode,
      isActive: true,
      isArchived: false,
    }).lean();
    return res.json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
});

// 6. Common Status workflow steps for Card Processing
cardProcessingMasterRouter.get("/lookup/statuses", async (req, res, next) => {
  try {
    const statuses = await CommonStatusMaster.find({
      module: { $in: ["Card Processing", "Access Card Approval"] },
      isArchived: false,
    })
      .sort({ sequence: 1 })
      .select("statusCode statusName sequence")
      .lean();
    return res.json({ success: true, data: statuses });
  } catch (error) {
    next(error);
  }
});

// 7. My Requests (Mobile App resident view)
cardProcessingMasterRouter.get("/my-requests/:residentId", async (req, res, next) => {
  try {
    const getService = makeGetCardProcessingMasterService();
    const result = await getService.execute({ residentId: req.params.residentId });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// ================================================================
// MAIN CRUD ROUTES
// ================================================================

// GET ALL — Web Portal List View
// Supports ?residentId=xxx & ?projectCode=xxx & ?userId=xxx & ?isArchived=1
cardProcessingMasterRouter.get("/", async (req, res, next) => {
  try {
    const getService = makeGetCardProcessingMasterService();
    const result = await getService.execute({
      isArchived: req.query.isArchived === "1",
      residentId: req.query.residentId as string | undefined,
      projectCode: req.query.projectCode as string | undefined,
      userId: req.query.userId as string | undefined,
    });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// POST — Resident submits lost card replacement request from Mobile App
cardProcessingMasterRouter.post("/", async (req, res, next) => {
  try {
    const input = combineRequestInput(req);
    const payload = req.body && Object.keys(req.body).length > 0 ? req.body : input;

    const createService = makeCreateCardProcessingMasterService();
    const result = await createService.execute(payload);

    if (!result.hasFailed()) {
      const created = result.getValue() as any;
      // Also fetch staff mapped to this project code to show assigned card staff
      const cardStaff = await AccessCardStaffMaster.find({
        projectCode: created.projectCode,
        isActive: true,
        isArchived: false,
      }).lean();

      return res.status(200).json({
        success: true,
        data: {
          ...created,
          assignedStaff: cardStaff.map((s: any) => ({
            id: s.id,
            staffRole: s.staffRole,
            projectCode: s.projectCode,
          })),
        },
      });
    }

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// GET SINGLE — by id or requestNo
cardProcessingMasterRouter.get("/:id", async (req, res, next) => {
  try {
    const getSingleService = makeGetSingleCardProcessingMasterService();
    const result = await getSingleService.execute(req.params.id);
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// ================================================================
// PORTAL ACTIONS & APPROVAL ROUTES
// ================================================================

// PATCH /:id — General update (Status, Portal Suspension, Payment Status)
cardProcessingMasterRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body && Object.keys(req.body).length > 0 ? req.body : combineRequestInput(req);

    const updateService = makeUpdateCardProcessingMasterService();
    const result = await updateService.execute({ id, ...body });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/suspend — Toggle Portal-Only Card Suspension
cardProcessingMasterRouter.patch("/:id/suspend", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    const existing = await CardProcessingMaster.findOne(buildFilter(id));
    if (!existing) {
      return res.status(404).json({ success: false, error: "Card request not found" });
    }

    const newSuspensionState = body.isSuspended !== undefined ? Boolean(body.isSuspended) : !existing.isSuspended;

    const updateService = makeUpdateCardProcessingMasterService();
    const result = await updateService.execute({
      id,
      isSuspended: newSuspensionState,
      approverId: body.approverId,
      remarks: `Portal card suspension set to ${newSuspensionState ? "SUSPENDED" : "ACTIVE"}`,
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/approve — Advance replacement status ("In Process", "Ready", "Delivered")
cardProcessingMasterRouter.patch("/:id/approve", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    const targetStatus = body.replacementStatus || body.status || "In Process";

    const updateService = makeUpdateCardProcessingMasterService();
    const result = await updateService.execute({
      id,
      replacementStatus: targetStatus,
      approverId: body.approverId,
      remarks: body.remarks || `Replacement status updated to '${targetStatus}'. Email confirmation dispatched.`,
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/reject — Reject card replacement request
cardProcessingMasterRouter.patch("/:id/reject", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};
    const reason = body.rejectionReason?.trim() || "Information mismatch or unpaid replacement fee";

    const updateService = makeUpdateCardProcessingMasterService();
    const result = await updateService.execute({
      id,
      replacementStatus: "Rejected",
      rejectionReason: reason,
      approverId: body.approverId,
      remarks: `Request rejected: ${reason}`,
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// ================================================================
// Helper Filter Function
// ================================================================
function buildFilter(id: string) {
  const conditions: any[] = [{ id }, { requestNo: id }];
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    conditions.push({ _id: new mongoose.Types.ObjectId(id) });
  }
  return { $or: conditions };
}