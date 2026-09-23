import express from "express";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";
import { getGuestAccessService } from "@/services/get-guest-access-service";
import { getSingleGuestAccessService } from "@/services/get-single-guest-access-service";
import { createGuestAccessService } from "@/services/create-guest-access-service";
import { updateGuestAccessService } from "@/services/update-guest-access-service";

import GateMaster from "@/schemas/gate-master-schema/gate-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";
import VehicleTypeMaster from "@/schemas/vehicle-type-master-schema/vehicle-type-master-schema";
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema/apartment-master-schema";
import ApprovalRoutingMaster from "@/schemas/approval-routing-master-schema/approval-routing-master-schema";
import SecurityCoordinatorMaster from "@/schemas/security-coordinator-master-schema/security-coordinator-master-schema";

export const guestApprovalMasterRouter = express.Router();

// ==========================================
// LOOKUP ROUTES — Must be BEFORE /:id routes
// ==========================================

// Vehicle Types Dropdown (for mobile resident form)
guestApprovalMasterRouter.get("/lookup/vehicle-types", async (request, response, next) => {
  try {
    const vehicleTypes = await VehicleTypeMaster.find({ isActive: true, isArchived: false })
      .select("id vehicleTypeId vehicleType")
      .lean();
    return response.json({ success: true, data: vehicleTypes });
  } catch (error: unknown) {
    next(error);
  }
});

// Common Status for Guest Access module
guestApprovalMasterRouter.get("/lookup/statuses", async (request, response, next) => {
  try {
    const statuses = await CommonStatusMaster.find({ module: "Guest Access", isArchived: false })
      .sort({ sequence: 1 })
      .select("statusCode statusName sequence")
      .lean();
    return response.json({ success: true, data: statuses });
  } catch (error: unknown) {
    next(error);
  }
});

// Gates filtered by projectCode (for approver gate assignment)
guestApprovalMasterRouter.get("/lookup/gates/:projectCode", async (request, response, next) => {
  try {
    const gates = await GateMaster.find({
      projectCode: request.params.projectCode,
      isActive: true,
      isArchived: false,
    }).lean();
    return response.json({ success: true, data: gates });
  } catch (error: unknown) {
    next(error);
  }
});

// Cascading Project -> Apartments + Residents
guestApprovalMasterRouter.get("/lookup/project-structure/:projectCode", async (request, response, next) => {
  try {
    const projectCode = request.params.projectCode;
    const [apartments, residents] = await Promise.all([
      ApartmentMaster.find({ projectCode, isArchived: false }).lean(),
      ResidentMaster.find({ projectCode, isArchived: false }).lean(),
    ]);
    return response.json({ success: true, data: { apartments, residents } });
  } catch (error: unknown) {
    next(error);
  }
});

// Approval Routing + Security Coordinators for a project
guestApprovalMasterRouter.get("/lookup/approval-routing/:projectCode", async (request, response, next) => {
  try {
    const projectCode = request.params.projectCode;
    const [approvalRouting, securityCoordinators] = await Promise.all([
      ApprovalRoutingMaster.find({ module: "Guest Access", projectCode, isActive: true, isArchived: false }).lean(),
      SecurityCoordinatorMaster.find({ projectCode, isActive: true, isArchived: false }).lean(),
    ]);
    return response.json({
      success: true,
      data: {
        requiredRoles: approvalRouting.map((ar: any) => ({ role: ar.approverRole, level: ar.approvalLevel })),
        notifiedUsers: securityCoordinators.map((sc: any) => ({ userId: sc.userId || sc.id, role: sc.coordinatorRole, projectCode: sc.projectCode })),
      },
    });
  } catch (error: unknown) {
    next(error);
  }
});

// Resident's own requests (for mobile My Requests screen)
guestApprovalMasterRouter.get("/my-requests/:residentId", async (request, response, next) => {
  try {
    const result = await getGuestAccessService.execute({ residentId: request.params.residentId });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// ==========================================
// MAIN CRUD & APPROVAL ROUTES
// ==========================================

// GET ALL — Web Portal Security Coordinator list view (fully enriched)
guestApprovalMasterRouter.get("/", async (request, response, next) => {
  try {
    const result = await getGuestAccessService.execute({
      isArchived: request.query?.isArchived === "1",
      residentId: request.query?.residentId as string | undefined,
    });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// POST — Resident submits new guest access request (from mobile)
guestApprovalMasterRouter.post("/", async (request, response, next) => {
  try {
    const input = combineRequestInput(request);
    const result = await createGuestAccessService.execute(input.body);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// GET SINGLE — by id (must be after all /lookup/* routes)
guestApprovalMasterRouter.get("/:id", async (request, response, next) => {
  try {
    const result = await getSingleGuestAccessService.execute(request.params.id);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH /:id — Main update route used by Web Portal frontend
guestApprovalMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);
    const body = input.body || {};

    const payload: any = {
      ...body,
      id,
      _id: body._id || id,
    };

    if (body.status === "Approved") {
      payload.approvalStatus = "Approved";
      payload.qrCode = body.qrCode || `QR-${id}-${Date.now()}`;
      payload.qrStatus = "Active";
    } else if (body.status === "Rejected") {
      payload.approvalStatus = "Rejected";
      payload.qrStatus = "Inactive";
    }

    const result = await updateGuestAccessService.execute(payload);
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH /:id/approve — Convenience route for mobile / guard
guestApprovalMasterRouter.patch("/:id/approve", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);
    const body = input.body || {};

    const result = await updateGuestAccessService.execute({
      id,
      _id: body._id || id,
      assignedGateId: body.assignedGateId,
      approverId: body.approverId,
      status: "Approved",
      approvalStatus: "Approved",
      qrCode: `QR-${id}-${Date.now()}`,
      qrStatus: "Active",
    });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH /:id/reject — Convenience route for mobile / guard
guestApprovalMasterRouter.patch("/:id/reject", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);
    const body = input.body || {};

    const result = await updateGuestAccessService.execute({
      id,
      _id: body._id || id,
      approverId: body.approverId,
      rejectionReason: body.rejectionReason?.trim() || "Security criteria not met",
      status: "Rejected",
      approvalStatus: "Rejected",
      qrStatus: "Inactive",
    });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH /:id/checkin — Guard scans QR to check in visitor
guestApprovalMasterRouter.patch("/:id/checkin", async (request, response, next) => {
  try {
    const id = request.params.id;
    const result = await updateGuestAccessService.execute({
      id,
      status: "Checked-in",
      approvalStatus: "Checked-in",
      qrStatus: "Used",
      checkInDateTime: new Date(),
    });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});