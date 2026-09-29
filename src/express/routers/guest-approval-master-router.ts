import express from "express";
import mongoose from "mongoose";
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
import QRConfigurationMaster from "@/schemas/qr-configuration-master-schema/qr-configuration-master-schema";
import GuestAccess from "@/schemas/guest-access-schema/guest-access-schema";
import QRScanLogMaster from "@/schemas/qr-scan-log-master-schema/qr-scan-log-master-schema";

export const guestApprovalMasterRouter = express.Router();

// Helper to fetch active QR Configuration from Master table
async function getActiveQrConfig() {
  try {
    const config = await QRConfigurationMaster.findOne({ isActive: true, isArchived: false }).lean();
    if (config) {
      return {
        expiryHours: config.expiryHours ?? 24,
        isOneTimeScan: config.isOneTimeScan ?? true,
        isGateValidation: config.isGateValidation ?? true,
        isPdfRequired: config.isPdfRequired ?? false,
      };
    }
  } catch (error) {
    console.error("Error fetching QR configuration:", error);
  }
  // Default fallback if no configuration is set in QR Configuration Master
  return {
    expiryHours: 24,
    isOneTimeScan: true,
    isGateValidation: true,
    isPdfRequired: false,
  };
}

// ==========================================
// LOOKUP & MOBILE SPECIAL ROUTES
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

// Safe Mongoose Query Filter helper to prevent CastError on non-24-char hex strings
function buildQueryFilter(idStr: string) {
  if (mongoose.Types.ObjectId.isValid(idStr) && idStr.length === 24) {
    return { $or: [{ _id: new mongoose.Types.ObjectId(idStr) }, { id: idStr }, { requestNo: idStr }] };
  }
  return { $or: [{ id: idStr }, { requestNo: idStr }] };
}

// MOBILE API: Fetch QR Code Details & Config for an Approved Request
guestApprovalMasterRouter.get("/mobile/qr-details/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const filter = buildQueryFilter(id);
    const record: any = await GuestAccess.findOne(filter).lean();

    if (!record) {
      return response.status(404).json({ success: false, error: "Guest request not found" });
    }

    if (record.approvalStatus !== "Approved") {
      return response.status(400).json({
        success: false,
        error: "Request is not approved yet",
        status: record.status,
        approvalStatus: record.approvalStatus,
      });
    }

    const isExpired = record.qrExpiryDate ? new Date() > new Date(record.qrExpiryDate) : false;

    const qrText = encodeURIComponent(record.qrCode || `QR-${record.id}`);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrText}`;

    return response.json({
      success: true,
      data: {
        id: record.id,
        requestNo: record.requestNo,
        residentId: record.residentId,
        apartmentId: record.apartmentId,
        projectCode: record.projectCode,
        assignedGateId: record.assignedGateId,
        status: record.status,
        approvalStatus: record.approvalStatus,
        qrCode: record.qrCode,
        qrImageUrl: qrImageUrl,
        qrImageDownloadUrl: `/guest-approval-request/qr-image/${record.id || record.requestNo}`,
        qrStatus: isExpired ? "Expired" : record.qrStatus,
        qrExpiryDate: record.qrExpiryDate,
        isExpired,
        qrConfiguration: {
          expiryHours: record.expiryHours ?? 24,
          isOneTimeScan: record.isOneTimeScan ?? true,
          isGateValidation: record.isGateValidation ?? true,
          isPdfRequired: record.isPdfRequired ?? false,
        },
        // pdfPassUrl: record.isPdfRequired ? `/guest-approval-master/pdf/${record.id}` : null,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
});

// PNG QR Code Image Download API (No installation required)
guestApprovalMasterRouter.get("/qr-image/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const filter = buildQueryFilter(id);
    const record: any = await GuestAccess.findOne(filter).lean();

    if (!record || !record.qrCode) {
      return response.status(404).send("QR Code record not found");
    }

    const qrText = encodeURIComponent(record.qrCode);
    const qrServerUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${qrText}`;

    response.setHeader("Content-Disposition", `attachment; filename="qr-code-${record.requestNo || record.id}.png"`);
    response.setHeader("Content-Type", "image/png");

    const axios = (await import("axios")).default;
    const imageStream = await axios.get(qrServerUrl, { responseType: "stream" });
    return imageStream.data.pipe(response);
  } catch (error: unknown) {
    next(error);
  }
});

// Core QR Code Verification and Scan History Logger
async function processQrScan(qrCodeInput: string, gateId?: string, gateName?: string) {
  if (!qrCodeInput) {
    return { statusCode: 400, data: { success: false, code: "bad-request", error: "QR Code is required" } };
  }

  // Search by qrCode, requestNo, or id
  const record: any = await GuestAccess.findOne({
    $or: [{ qrCode: qrCodeInput }, { requestNo: qrCodeInput }, { id: qrCodeInput }],
  });

  if (!record) {
    return { statusCode: 404, data: { success: false, code: "not-found", error: "Invalid QR Code — Record not found" } };
  }

  const now = new Date();
  const currentTotalAttempts = (await QRScanLogMaster.countDocuments({ qrCode: record.qrCode })) + 1;
  const previousVerifiedScans = await QRScanLogMaster.countDocuments({ qrCode: record.qrCode, status: "Verified" });

  // 1. APPROVAL STATUS CHECK
  if (record.approvalStatus !== "Approved" && record.status !== "Approved") {
    await QRScanLogMaster.create({
      id: `SCAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      guestAccessId: record.id || record._id,
      requestNo: record.requestNo,
      qrCode: record.qrCode || qrCodeInput,
      gateId: gateId || record.assignedGateId,
      gateName: gateName || null,
      scannedAt: now,
      attemptNumber: currentTotalAttempts,
      status: "Failed",
      reason: `Request status is ${record.approvalStatus || record.status}, not Approved`,
    });

    return {
      statusCode: 400,
      data: {
        success: false,
        code: "not-approved",
        error: `Access request status is '${record.approvalStatus || record.status}'. Only Approved requests can be scanned.`,
      },
    };
  }

  // 2. EXPIRY CHECK
  if (record.qrExpiryDate && now > new Date(record.qrExpiryDate)) {
    record.status = "Expired";
    record.approvalStatus = "Expired";
    record.qrStatus = "Expired";
    await record.save();

    await QRScanLogMaster.create({
      id: `SCAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      guestAccessId: record.id || record._id,
      requestNo: record.requestNo,
      qrCode: record.qrCode || qrCodeInput,
      gateId: gateId || record.assignedGateId,
      gateName: gateName || null,
      scannedAt: now,
      attemptNumber: currentTotalAttempts,
      status: "Failed",
      reason: "QR Code expired",
    });

    return {
      statusCode: 400,
      data: {
        success: false,
        code: "qr-expired",
        error: `QR Code expired at ${new Date(record.qrExpiryDate).toLocaleString()}`,
        status: "Expired",
        scanCount: currentTotalAttempts,
      },
    };
  }

  // 3. GATE VALIDATION CHECK
  if (record.isGateValidation && record.assignedGateId && gateId && record.assignedGateId !== gateId) {
    await QRScanLogMaster.create({
      id: `SCAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      guestAccessId: record.id || record._id,
      requestNo: record.requestNo,
      qrCode: record.qrCode || qrCodeInput,
      gateId: gateId,
      gateName: gateName || null,
      scannedAt: now,
      attemptNumber: currentTotalAttempts,
      status: "Failed",
      reason: `Gate mismatch (Assigned: ${record.assignedGateId}, Scanned: ${gateId})`,
    });

    return {
      statusCode: 400,
      data: {
        success: false,
        code: "invalid-gate",
        error: `Gate validation failed. QR Code is assigned to Gate '${record.assignedGateId}', but scanned at '${gateId}'.`,
        scanCount: currentTotalAttempts,
      },
    };
  }

  // 4. ONE-TIME SCAN CHECK
  if (record.isOneTimeScan && (previousVerifiedScans >= 1 || record.qrStatus === "Used")) {
    const firstScan: any = await QRScanLogMaster.findOne({ qrCode: record.qrCode, status: "Verified" })
      .sort({ scannedAt: 1 })
      .lean();

    await QRScanLogMaster.create({
      id: `SCAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      guestAccessId: record.id || record._id,
      requestNo: record.requestNo,
      qrCode: record.qrCode || qrCodeInput,
      gateId: gateId || record.assignedGateId,
      gateName: gateName || null,
      scannedAt: now,
      attemptNumber: currentTotalAttempts,
      status: "Failed",
      reason: "Already scanned (One-time scan only)",
    });

    return {
      statusCode: 400,
      data: {
        success: false,
        code: "already-scanned",
        error: `QR Code has already been scanned on ${firstScan ? new Date(firstScan.scannedAt).toLocaleString() : "previous attempt"}. (One-time scan limit reached)`,
        firstScannedAt: firstScan ? firstScan.scannedAt : record.checkInDateTime,
        totalScanAttempts: currentTotalAttempts,
        verifiedScans: previousVerifiedScans,
      },
    };
  }

  // 5. SUCCESSFUL SCAN (Verified Check-In)
  record.status = "Checked-in";
  record.approvalStatus = "Checked-in";
  if (record.isOneTimeScan) {
    record.qrStatus = "Used";
  }
  record.checkInDateTime = now;
  await record.save();

  await QRScanLogMaster.create({
    id: `SCAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    guestAccessId: record.id || record._id,
    requestNo: record.requestNo,
    qrCode: record.qrCode || qrCodeInput,
    gateId: gateId || record.assignedGateId,
    gateName: gateName || null,
    scannedAt: now,
    attemptNumber: currentTotalAttempts,
    status: "Verified",
    reason: "Visitor verified and checked in successfully",
  });

  const [resident, apartment] = await Promise.all([
    ResidentMaster.findOne({ id: record.residentId }).lean(),
    ApartmentMaster.findOne({ id: record.apartmentId }).lean(),
  ]);

  return {
    statusCode: 200,
    data: {
      success: true,
      code: "verified",
      message: "QR Code Verified Successfully! Visitor Granted Access.",
      visitor: {
        id: record.id,
        requestNo: record.requestNo,
        residentName: (resident as any)?.name || record.residentId,
        apartmentNo: (apartment as any)?.apartmentNo || record.apartmentId,
        projectCode: record.projectCode,
        vehiclePlateNo: record.vehiclePlateNo || "N/A",
        vehicleType: record.vehicleType || "N/A",
        assignedGateId: record.assignedGateId,
        status: record.status,
        checkInDateTime: now,
        scanCount: currentTotalAttempts,
        totalVerifiedScans: previousVerifiedScans + 1,
        isOneTimeScan: record.isOneTimeScan ?? true,
      },
    },
  };
}

// GUARD MOBILE API: Scan QR Code (/mobile/scan-qr)
guestApprovalMasterRouter.post("/mobile/scan-qr", async (request, response, next) => {
  try {
    const { qrCode, gateId, gateName } = request.body || {};
    const result = await processQrScan(qrCode, gateId, gateName);
    return response.status(result.statusCode).json(result.data);
  } catch (error: unknown) {
    next(error);
  }
});

// // GUARD MOBILE API: Scan QR Code (Endpoint 2: /scan-qr)
// guestApprovalMasterRouter.post("/scan-qr", async (request, response, next) => {
//   try {
//     const { qrCode, gateId, gateName } = request.body || {};
//     const result = await processQrScan(qrCode, gateId, gateName);
//     return response.status(result.statusCode).json(result.data);
//   } catch (error: unknown) {
//     next(error);
//   }
// });

// GET SCAN HISTORY LOGS API
guestApprovalMasterRouter.get("/scan-history/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const filter = buildQueryFilter(id);
    const record: any = await GuestAccess.findOne(filter).lean();

    const queryKey = record?.qrCode || id;
    const logs = await QRScanLogMaster.find({
      $or: [{ qrCode: queryKey }, { requestNo: queryKey }, { guestAccessId: queryKey }],
    })
      .sort({ scannedAt: -1 })
      .lean();

    return response.json({
      success: true,
      data: {
        requestNo: record?.requestNo || id,
        totalScans: logs.length,
        logs,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
});

// PDF Pass Endpoint (renders visitor pass HTML)
// guestApprovalMasterRouter.get("/pdf/:id", async (request, response, next) => {
//   try {
//     const id = request.params.id;
//     const filter = buildQueryFilter(id);
//     const record: any = await GuestAccess.findOne(filter).lean();

//     if (!record) {
//       return response.status(404).send("<h1>Visitor Pass Not Found</h1>");
//     }

//     const html = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Visitor Pass - ${record.requestNo}</title>
//         <style>
//           body { font-family: sans-serif; padding: 30px; background: #f4f6f8; }
//           .card { max-width: 450px; margin: auto; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #3b82f6; }
//           h2 { color: #1e3a8a; margin-top: 0; }
//           .qr { font-size: 20px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 12px; text-align: center; border-radius: 8px; margin: 15px 0; }
//           .field { margin-bottom: 8px; font-size: 14px; }
//           .label { font-weight: bold; color: #4b5563; }
//         </style>
//       </head>
//       <body>
//         <div class="card">
//           <h2>EMPIRE WORLD VISITOR PASS</h2>
//           <div class="qr">${record.qrCode || "QR-PASS"}</div>
//           <div class="field"><span class="label">Request No:</span> ${record.requestNo}</div>
//           <div class="field"><span class="label">Resident ID:</span> ${record.residentId}</div>
//           <div class="field"><span class="label">Apartment:</span> ${record.apartmentId}</div>
//           <div class="field"><span class="label">Project:</span> ${record.projectCode}</div>
//           <div class="field"><span class="label">Assigned Gate:</span> ${record.assignedGateId || "All Gates"}</div>
//           <div class="field"><span class="label">Status:</span> ${record.approvalStatus}</div>
//           <div class="field"><span class="label">Expiry Date:</span> ${record.qrExpiryDate ? new Date(record.qrExpiryDate).toLocaleString() : "N/A"}</div>
//         </div>
//       </body>
//       </html>
//     `;
//     response.setHeader("Content-Type", "text/html");
//     return response.send(html);
//   } catch (error: unknown) {
//     next(error);
//   }
// });

// ==========================================
// MAIN CRUD & APPROVAL ROUTES
// ==========================================

// GET ALL — Web Portal Security Coordinator list view (fully enriched)
guestApprovalMasterRouter.get("/", async (request, response, next) => {
  try {
    const result = await getGuestAccessService.execute({
      isArchived: request.query?.isArchived === "1",
      residentId: request.query?.residentId as string | undefined,
      userId: request.query?.userId as string | undefined, // <--- Logged-in user ki ID yahan lein
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
    const payload = (request.body && Object.keys(request.body).length > 0) ? request.body : input;
    const result = await createGuestAccessService.execute(payload);
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

// PATCH /:id — Main update route used by Web Portal frontend (Approval / Rejection)
guestApprovalMasterRouter.patch("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);
    const body = (request.body && Object.keys(request.body).length > 0) ? request.body : input;

    const payload: any = {
      ...body,
      id,
      _id: body._id || id,
    };

    if (body.status === "Approved") {
      const qrConfig = await getActiveQrConfig();
      const expiryHours = qrConfig.expiryHours;
      const qrExpiryDate = new Date(Date.now() + expiryHours * 3600 * 1000);

      payload.approvalStatus = "Approved";
      payload.qrCode = body.qrCode || `QR-${id}-${Date.now()}`;
      payload.qrStatus = "Active";
      payload.qrExpiryDate = qrExpiryDate;
      payload.expiryHours = expiryHours;
      payload.isOneTimeScan = qrConfig.isOneTimeScan;
      payload.isGateValidation = qrConfig.isGateValidation;
      payload.isPdfRequired = qrConfig.isPdfRequired;
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

// PATCH /:id/approve — Convenience approval route for Web Portal / Mobile
guestApprovalMasterRouter.patch("/:id/approve", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);
    const body = (request.body && Object.keys(request.body).length > 0) ? request.body : input;

    const qrConfig = await getActiveQrConfig();
    const expiryHours = qrConfig.expiryHours;
    const qrExpiryDate = new Date(Date.now() + expiryHours * 3600 * 1000);

    const result = await updateGuestAccessService.execute({
      id,
      _id: body._id || id,
      assignedGateId: body.assignedGateId,
      approverId: body.approverId,
      status: "Approved",
      approvalStatus: "Approved",
      qrCode: body.qrCode || `QR-${id}-${Date.now()}`,
      qrStatus: "Active",
      qrExpiryDate,
      expiryHours,
      isOneTimeScan: qrConfig.isOneTimeScan,
      isGateValidation: qrConfig.isGateValidation,
      isPdfRequired: qrConfig.isPdfRequired,
    });
    return presentResult(result, response);
  } catch (error: unknown) {
    next(error);
  }
});

// PATCH /:id/reject — Convenience rejection route
guestApprovalMasterRouter.patch("/:id/reject", async (request, response, next) => {
  try {
    const id = request.params.id;
    const input = combineRequestInput(request);
    const body = (request.body && Object.keys(request.body).length > 0) ? request.body : input;

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