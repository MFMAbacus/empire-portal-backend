import express from "express";
import mongoose from "mongoose";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getMoveApprovalService } from "@/services/get-move-approval-service";
import { getSingleMoveApprovalService } from "@/services/get-single-move-approval-service";
import { createMoveApprovalService } from "@/services/create-move-approval-service";
import { updateMoveApprovalService } from "@/services/update-move-approval-service";

import MovementTypeMaster from "@/schemas/movement-type-master-schema/movement-type-master-schema";
import ItemTypeMaster from "@/schemas/item-type-master-schema/item-type-master-schema";
import MovementRuleMaster from "@/schemas/movement-rule-master-schema/movement-rule-master-schema";
import PropertyManagementApprovalMaster from "@/schemas/property-management-approval-master-schema/property-management-approval-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema/apartment-master-schema";
import MoveApproval from "@/schemas/move-approval-schema/move-approval-schema";

export const moveApprovalMasterRouter = express.Router();

// ================================================================
// LOOKUP ROUTES  (must come before /:id)
// ================================================================

// Movement Types dropdown (for mobile app)
moveApprovalMasterRouter.get("/lookup/movement-types", async (req, res, next) => {
  try {
    const docs = await MovementTypeMaster.find({ isActive: true, isArchived: false }).lean();
    return res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
});

// Item Types dropdown (for mobile app)
moveApprovalMasterRouter.get("/lookup/item-types", async (req, res, next) => {
  try {
    const docs = await ItemTypeMaster.find({ isActive: true, isArchived: false }).lean();
    return res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
});

// Movement Rules for a project (for mobile rule pre-check)
moveApprovalMasterRouter.get("/lookup/movement-rule/:projectCode", async (req, res, next) => {
  try {
    const rule = await MovementRuleMaster.findOne({
      projectCode: req.params.projectCode,
      isActive: true,
      isArchived: false,
    }).lean();
    return res.json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
});

// Approvers mapped to a project (for portal)
moveApprovalMasterRouter.get("/lookup/approvers/:projectCode", async (req, res, next) => {
  try {
    const approvers = await PropertyManagementApprovalMaster.find({
      projectCode: req.params.projectCode,
      isActive: true,
      isArchived: false,
    }).lean();
    return res.json({ success: true, data: approvers });
  } catch (error) {
    next(error);
  }
});

// Status list for Move Approval module (CommonStatusMaster driven)
moveApprovalMasterRouter.get("/lookup/statuses", async (req, res, next) => {
  try {
    const statuses = await CommonStatusMaster.find({
      module: "Move Approval",
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

// Resident's own move requests (for mobile My Requests screen)
moveApprovalMasterRouter.get("/my-requests/:residentId", async (req, res, next) => {
  try {
    const result = await getMoveApprovalService.execute({ residentId: req.params.residentId });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// ================================================================
// MAIN CRUD ROUTES
// ================================================================

// GET ALL — Web Portal list view (enriched)
// Supports ?residentId=xxx and ?isArchived=1
moveApprovalMasterRouter.get("/", async (req, res, next) => {
  try {
    const result = await getMoveApprovalService.execute({
      isArchived: req.query.isArchived === "1",
      residentId: req.query.residentId as string | undefined,
      userId: req.query.userId as string | undefined,
    });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// POST — Resident submits move-in/move-out request (Mobile App)
// Validates time/day rules automatically, sets status = Pending (seq 1)
// Also routes notification to PropertyManagementApprovalMaster mapped approver
moveApprovalMasterRouter.post("/", async (req, res, next) => {
  try {
    const input = combineRequestInput(req);
    const payload = req.body && Object.keys(req.body).length > 0 ? req.body : input;

    const result = await createMoveApprovalService.execute(payload);

    if (!result.hasFailed()) {
      const created = result.getValue() as any;
      // Fetch the property approver for this project so the mobile/portal knows who will approve
      const approvers = await PropertyManagementApprovalMaster.find({
        projectCode: created.projectCode,
        isActive: true,
        isArchived: false,
      }).lean();

      return res.status(200).json({
        success: true,
        data: {
          ...created,
          approvers: approvers.map((a: any) => ({
            id: a.id,
            approverRole: a.approverRole,
            projectCode: a.projectCode,
          })),
        },
      });
    }

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// GET SINGLE — by id or requestNo (must be after lookup routes)
moveApprovalMasterRouter.get("/:id", async (req, res, next) => {
  try {
    const result = await getSingleMoveApprovalService.execute(req.params.id);
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// ================================================================
// APPROVAL / REJECTION ROUTES  (Portal)
// ================================================================

// PATCH /:id — General update (used by portal for approve/reject)
moveApprovalMasterRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body && Object.keys(req.body).length > 0 ? req.body : combineRequestInput(req);

    // Resolve status from CommonStatusMaster sequence if needed
    // Sequence 1 = Pending | 2 = Approved | 3 = Rejected
    let resolvedStatus = body.status;
    if (!resolvedStatus && body.sequence !== undefined) {
      const statusDoc = await CommonStatusMaster.findOne({
        module: "Move Approval",
        sequence: body.sequence,
        isArchived: false,
      }).lean();
      resolvedStatus = (statusDoc as any)?.statusName ?? null;
    }

    const payload: any = {
      ...body,
      id,
      _id: body._id || id,
    };

    if (resolvedStatus) payload.status = resolvedStatus;

    // Append approval history entry
    const historyEntry: any = {
      action: resolvedStatus ?? body.status ?? "Updated",
      approverId: body.approverId ?? null,
      timestamp: new Date().toISOString(),
      remarks: body.rejectionReason ?? body.remarks ?? null,
    };

    // We push history inside the repository via $push — handle with raw update
    const record: any = await MoveApproval.findOneAndUpdate(
      buildFilter(id),
      {
        $set: {
          status: resolvedStatus ?? body.status,
          approverId: body.approverId,
          ...(body.rejectionReason ? { rejectionReason: body.rejectionReason } : {}),
        },
        $push: { approvalHistory: historyEntry },
      },
      { new: true, runValidators: false }
    ).lean();

    if (!record) {
      return res.status(404).json({ success: false, error: "Move approval request not found" });
    }

    return res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/approve — Explicit approval route
moveApprovalMasterRouter.patch("/:id/approve", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    // Fetch Approved status name from CommonStatusMaster (sequence 2)
    const approvedStatus = await CommonStatusMaster.findOne({
      module: "Move Approval",
      sequence: 2,
      isArchived: false,
    }).lean();
    const statusName = (approvedStatus as any)?.statusName ?? "Approved";

    const historyEntry = {
      action: statusName,
      approverId: body.approverId ?? null,
      timestamp: new Date().toISOString(),
      remarks: body.remarks ?? null,
    };

    const record: any = await MoveApproval.findOneAndUpdate(
      buildFilter(id),
      {
        $set: {
          status: statusName,
          approverId: body.approverId ?? null,
        },
        $push: { approvalHistory: historyEntry },
      },
      { new: true, runValidators: false }
    ).lean();

    if (!record) {
      return res.status(404).json({ success: false, error: "Move approval request not found" });
    }

    return res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/reject — Explicit rejection route
moveApprovalMasterRouter.patch("/:id/reject", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    // Fetch Rejected status name from CommonStatusMaster (sequence 3)
    const rejectedStatus = await CommonStatusMaster.findOne({
      module: "Move Approval",
      sequence: 3,
      isArchived: false,
    }).lean();
    const statusName = (rejectedStatus as any)?.statusName ?? "Rejected";

    const reason = body.rejectionReason?.trim() || "Timing or item rule violation";

    const historyEntry = {
      action: statusName,
      approverId: body.approverId ?? null,
      timestamp: new Date().toISOString(),
      remarks: reason,
    };

    const record: any = await MoveApproval.findOneAndUpdate(
      buildFilter(id),
      {
        $set: {
          status: statusName,
          rejectionReason: reason,
          approverId: body.approverId ?? null,
        },
        $push: { approvalHistory: historyEntry },
      },
      { new: true, runValidators: false }
    ).lean();

    if (!record) {
      return res.status(404).json({ success: false, error: "Move approval request not found" });
    }

    return res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
});

// ================================================================
// Helper
// ================================================================
function buildFilter(id: string) {
  const conditions: any[] = [{ id }, { requestNo: id }];
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    conditions.push({ _id: new mongoose.Types.ObjectId(id) });
  }
  return { $or: conditions };
}