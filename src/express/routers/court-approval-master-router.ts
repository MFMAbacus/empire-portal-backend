import express from "express";
import mongoose from "mongoose";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getCourtApprovalService } from "@/services/get-court-approval-service";
import { getSingleCourtApprovalService } from "@/services/get-single-court-approval-service";
import { createCourtApprovalService } from "@/services/create-court-approval-service";
import { updateCourtApprovalService } from "@/services/update-court-approval-service";

import CourtMaster from "@/schemas/court-master-schema/court-master-schema";
import ProjectCourtMaster from "@/schemas/project-court-master-schema/project-court-master-schema";
import CourtOperatingMaster from "@/schemas/court-operating-master-schema/court-operating-master-schema";
import CourtTimeMaster from "@/schemas/court-time-master-schema/court-time-master-schema";
import CourtBlockingMaster from "@/schemas/court-blocking-master-schema/court-blocking-master-schema";
import FacilityApprovalMaster from "@/schemas/facility-approval-master-schema/facility-approval-master-schema";
import CourtBookingMaster from "@/schemas/court-booking-master-schema/court-booking-master-schema";
import CourtApproval from "@/schemas/court-approval-schema/court-approval-schema";

export const courtApprovalMasterRouter = express.Router();

function buildFilter(id: string) {
  const conditions: any[] = [{ id }, { reservationNo: id }, { requestNo: id }];
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    conditions.push({ _id: new mongoose.Types.ObjectId(id) });
  }
  return { $or: conditions };
}

// ================================================================
// LOOKUP & MOBILE SPECIAL ROUTES
// ================================================================

// 1. Resident Courts Listing filtered by Project-Court Mapping
courtApprovalMasterRouter.get("/lookup/courts/:projectCode", async (req, res, next) => {
  try {
    const projectCode = req.params.projectCode;

    const mappedCourts = await ProjectCourtMaster.find({
      projectCode,
      isAccess: true,
      isActive: true,
      isArchived: false,
    }).lean();

    const allowedCourtIds = mappedCourts.map((mc: any) => mc.courtId);

    const courts = await CourtMaster.find({
      $or: [
        { projectCode },
        { courtId: { $in: allowedCourtIds } },
        { id: { $in: allowedCourtIds } },
      ],
      isActive: true,
      isArchived: false,
    }).lean();

    return res.json({ success: true, data: courts });
  } catch (error) {
    next(error);
  }
});

// 2. Comprehensive Court Details & Booking Rules Bundle
courtApprovalMasterRouter.get("/lookup/court-details/:courtId", async (req, res, next) => {
  try {
    const courtId = req.params.courtId;
    const projectCode = req.query.projectCode as string | undefined;

    const court = await CourtMaster.findOne({
      $or: [{ courtId }, { id: courtId }],
      isArchived: false,
    }).lean();

    const operatingHours = await CourtOperatingMaster.find({
      $or: [{ courtId }, { id: courtId }],
      isActive: true,
      isArchived: false,
    }).lean();

    const timeSlots = await CourtTimeMaster.find({
      $or: [{ courtId }, { id: courtId }],
      isActive: true,
      isArchived: false,
    }).lean();

    const activeBlocks = await CourtBlockingMaster.find({
      $or: [{ courtId }, { id: courtId }],
      isActive: true,
      isArchived: false,
    }).lean();

    const effProject = projectCode || (court as any)?.projectCode || "EMP-WORLD-01";
    const bookingRules = await CourtBookingMaster.findOne({
      $or: [{ projectCode: effProject }, { id: effProject }],
      isArchived: false,
    }).lean();

    return res.json({
      success: true,
      data: {
        court,
        operatingHours,
        timeSlots,
        activeBlocks,
        bookingRules: bookingRules || {
          maxBooking: 60,
          advanceBooking: 7,
          pendingSlot: true,
          projectCode: effProject,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// 3. Court Operating Hours lookup
courtApprovalMasterRouter.get("/lookup/operating-hours/:courtId", async (req, res, next) => {
  try {
    const courtId = req.params.courtId;
    const hours = await CourtOperatingMaster.find({
      $or: [{ courtId }, { id: courtId }],
      isActive: true,
      isArchived: false,
    }).lean();

    return res.json({ success: true, data: hours });
  } catch (error) {
    next(error);
  }
});

// 4. Court Time Slots lookup
courtApprovalMasterRouter.get("/lookup/time-slots/:courtId", async (req, res, next) => {
  try {
    const courtId = req.params.courtId;
    const slots = await CourtTimeMaster.find({
      $or: [{ courtId }, { id: courtId }],
      isActive: true,
      isArchived: false,
    }).lean();

    return res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
});

// 5. Calculate Available Time Slots with Full Validation against Operating Hours, Blocks & Project Rules
courtApprovalMasterRouter.get("/lookup/available-slots", async (req, res, next) => {
  try {
    const { courtId, bookingDate, projectCode } = req.query as {
      courtId?: string;
      bookingDate?: string;
      projectCode?: string;
    };

    if (!courtId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "courtId and bookingDate query parameters are required.",
      });
    }

    // A. Day of Week Check
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateObj = new Date(bookingDate);
    const dayName = !isNaN(dateObj.getTime()) ? days[dateObj.getDay()] : "";

    // B. Operating Hours Check for court & day
    const operatingHour = await CourtOperatingMaster.findOne({
      $or: [{ courtId }, { id: courtId }],
      day: { $regex: new RegExp(`^${dayName}$`, "i") },
      isArchived: false,
      isActive: true,
    }).lean();

    const isClosedOnDay = operatingHour ? (operatingHour as any).isClosed : false;
    const openTime = operatingHour ? (operatingHour as any).openTime : undefined;
    const closeTime = operatingHour ? (operatingHour as any).closeTime : undefined;

    // C. Project Booking Rules Lookup
    let effProjectCode = projectCode;
    if (!effProjectCode) {
      const court = await CourtMaster.findOne({
        $or: [{ id: courtId }, { courtId }],
        isArchived: false,
      }).lean();
      if (court) effProjectCode = (court as any).projectCode;
    }

    const bookingRule = await CourtBookingMaster.findOne({
      $or: [{ projectCode: effProjectCode }, { id: effProjectCode }],
      isArchived: false,
      isActive: true,
    }).lean();

    const maxBookingDuration = bookingRule ? (bookingRule as any).maxBooking : 4;
    const advanceBookingDays = bookingRule ? (bookingRule as any).advanceBooking : 7;
    const pendingSlotBlocking = bookingRule ? (bookingRule as any).pendingSlot : true;

    // Advance Booking Date Limit Validation
    let isAdvanceBookingExceeded = false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(bookingDate);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > advanceBookingDays) {
      isAdvanceBookingExceeded = true;
    }

    // D. Master Time Slots
    const masterSlots = await CourtTimeMaster.find({
      $or: [{ courtId }, { id: courtId }],
      isActive: true,
      isArchived: false,
    }).lean();

    const defaultTimeSlots = [
      "08:00 AM - 09:00 AM",
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM",
      "05:00 PM - 06:00 PM",
      "06:00 PM - 07:00 PM",
      "07:00 PM - 08:00 PM",
    ];

    let allSlots = masterSlots.map((s: any) => `${s.startTime} - ${s.endTime}`);
    if (allSlots.length === 0) {
      allSlots = defaultTimeSlots;
    }

    // E. Facility Blocks on Date (Maintenance / PT)
    const blocks = await CourtBlockingMaster.find({
      $or: [{ courtId }, { id: courtId }],
      blockDate: bookingDate,
      isActive: true,
      isArchived: false,
    }).lean();

    // F. Existing Bookings on Date
    const existingBookings = await CourtApproval.find({
      courtId,
      bookingDate,
      status: { $in: ["Pending Blocked", "Approved", "Maintenance Blocked", "PT Session Blocked"] },
      isArchived: false,
    }).lean();

    const blockedSlotMap = new Map<string, string>();

    blocks.forEach((b: any) => {
      const blockSlotStr = `${b.startTime} - ${b.endTime}`;
      blockedSlotMap.set(blockSlotStr, `Blocked for ${b.reason || "Maintenance / PT Session"}`);
      if (b.startTime) {
        allSlots.forEach((slot) => {
          if (slot.includes(b.startTime)) {
            blockedSlotMap.set(slot, `Blocked for ${b.reason || "Maintenance / PT Session"}`);
          }
        });
      }
    });

    existingBookings.forEach((b: any) => {
      if (b.timeSlot) {
        blockedSlotMap.set(b.timeSlot, `Reserved by ${b.residentName || "Resident"} (${b.reservationNo})`);
      }
    });

    // G. Available Slot Status Array Calculation
    const availableSlots = allSlots.map((slot) => {
      if (isClosedOnDay) {
        return {
          timeSlot: slot,
          isAvailable: false,
          reason: `Court is closed on ${dayName}s (Operating Hours Rule)`,
        };
      }
      if (isAdvanceBookingExceeded) {
        return {
          timeSlot: slot,
          isAvailable: false,
          reason: `Advance booking limit exceeded (Max ${advanceBookingDays} days allowed)`,
        };
      }
      if (blockedSlotMap.has(slot)) {
        return {
          timeSlot: slot,
          isAvailable: false,
          reason: blockedSlotMap.get(slot),
        };
      }
      return {
        timeSlot: slot,
        isAvailable: true,
        reason: "Available",
      };
    });

    return res.json({
      success: true,
      courtId,
      bookingDate,
      dayName,
      isClosedOnDay,
      operatingHours: { openTime: openTime || "08:00 AM", closeTime: closeTime || "10:00 PM", isClosed: isClosedOnDay },
      bookingRules: {
        maxBookingDuration: `${maxBookingDuration} hours`,
        advanceBookingDays: `${advanceBookingDays} days`,
        pendingSlotBlocking,
      },
      activeBlocksCount: blocks.length,
      availableSlots,
    });
  } catch (error) {
    next(error);
  }
});

// 6. Resident's own court reservations (for Mobile App)
courtApprovalMasterRouter.get("/my-requests/:residentId", async (req, res, next) => {
  try {
    const result = await getCourtApprovalService.execute({ residentId: req.params.residentId });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// 7. Block Slot for Maintenance / PT Session (Facility Admin action)
courtApprovalMasterRouter.post("/block-slot", async (req, res, next) => {
  try {
    const { courtId, courtName, blockDate, startTime, endTime, reason, createdBy, blockType } = req.body ?? {};

    const blockId = `BLK-${Date.now().toString().slice(-6)}`;
    const blockingRecord = new CourtBlockingMaster({
      id: blockId,
      blockId,
      courtId: courtId || "COURT-01",
      blockDate: blockDate || new Date().toISOString().split("T")[0],
      startTime: startTime || "08:00 AM",
      endTime: endTime || "10:00 AM",
      reason: reason || "Facility Maintenance",
      createdBy: createdBy || "Admin",
      isActive: true,
      isArchived: false,
    });
    await blockingRecord.save();

    const timeSlot = `${startTime || "08:00 AM"} - ${endTime || "10:00 AM"}`;
    const seqNo = `CR-BLK-${Date.now().toString().slice(-5)}`;

    const blockingApproval = new CourtApproval({
      id: seqNo,
      reservationNo: seqNo,
      requestNo: seqNo,
      courtId: courtId || "COURT-01",
      courtName: courtName || "Sports Court",
      projectCode: "PRJ-MAIN",
      residentId: createdBy || "Facility Admin",
      residentName: "Facility Management",
      apartmentNo: "Staff",
      bookingDate: blockDate || new Date().toISOString().split("T")[0],
      timeSlot,
      duration: "Slot Blocked",
      status: blockType || "Maintenance Blocked",
      slotStatus: blockType || "Maintenance Blocked",
      notes: reason || "Facility Maintenance / PT Session",
      active: true,
      isArchived: false,
      approvalHistory: [
        {
          action: blockType || "Maintenance Blocked",
          approverId: createdBy || "Admin",
          timestamp: new Date().toISOString(),
          remarks: `Court slot blocked for ${reason || "Maintenance"}`,
        },
      ],
    });

    await blockingApproval.save();

    return res.status(200).json({
      success: true,
      message: "Court slot successfully blocked for Maintenance/PT session.",
      data: blockingApproval,
    });
  } catch (error) {
    next(error);
  }
});

// ================================================================
// MAIN CRUD ROUTES
// ================================================================

// GET ALL — Web Portal list view (with approver filtering)
courtApprovalMasterRouter.get("/", async (req, res, next) => {
  try {
    const result = await getCourtApprovalService.execute({
      isArchived: req.query.isArchived === "1",
      residentId: req.query.residentId as string | undefined,
      courtId: req.query.courtId as string | undefined,
      projectCode: req.query.projectCode as string | undefined,
      userId: req.query.userId as string | undefined,
      status: req.query.status as string | undefined,
    });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// POST — Submit court reservation (Mobile App)
courtApprovalMasterRouter.post("/", async (req, res, next) => {
  try {
    const input = combineRequestInput(req);
    const payload = req.body && Object.keys(req.body).length > 0 ? req.body : input;

    const result = await createCourtApprovalService.execute(payload);

    if (!result.hasFailed()) {
      const created = result.getValue() as any;
      const approvers = await FacilityApprovalMaster.find({
        projectCode: created.projectCode,
        isActive: true,
        isArchived: false,
      }).lean();

      return res.status(200).json({
        success: true,
        data: {
          ...created,
          mappedFacilityApprovers: approvers.map((a: any) => ({
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

// GET SINGLE
courtApprovalMasterRouter.get("/:id", async (req, res, next) => {
  try {
    const result = await getSingleCourtApprovalService.execute(req.params.id);
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id — General update
courtApprovalMasterRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body && Object.keys(req.body).length > 0 ? req.body : combineRequestInput(req);

    const payload = {
      ...body,
      id,
      _id: body._id || id,
    };

    const result = await updateCourtApprovalService.execute(payload);
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/approve — Explicit Approval Route
courtApprovalMasterRouter.patch("/:id/approve", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    const result = await updateCourtApprovalService.execute({
      id,
      status: "Approved",
      slotStatus: "Approved",
      approverId: body.approverId ?? "Facility Admin",
      remarks: body.remarks ?? "Court reservation approved by facility staff",
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/reject — Explicit Rejection Route
courtApprovalMasterRouter.patch("/:id/reject", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    const reason = body.rejectionReason?.trim() || "Slot unavailable / Court maintenance scheduled";

    const result = await updateCourtApprovalService.execute({
      id,
      status: "Rejected",
      slotStatus: "Rejected",
      rejectionReason: reason,
      approverId: body.approverId ?? "Facility Admin",
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});