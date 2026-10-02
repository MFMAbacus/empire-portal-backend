import express from "express";
import mongoose from "mongoose";
import { presentResult } from "@/express/present-result";
import { combineRequestInput } from "@/express/combine-request-input";

import { getRestaurantReservationApprovalService } from "@/services/get-restaurant-reservation-approval-service";
import { getSingleRestaurantReservationApprovalService } from "@/services/get-single-restaurant-reservation-approval-service";
import { createRestaurantReservationApprovalService } from "@/services/create-restaurant-reservation-approval-service";
import { updateRestaurantReservationApprovalService } from "@/services/update-restaurant-reservation-approval-service";

import VenueMaster from "@/schemas/venue-master-schema/venue-master-schema";
import ProjectVenueMaster from "@/schemas/project-venue-master-schema/project-venue-master-schema";
import VenueOperatingMaster from "@/schemas/venue-operating-master-schema/venue-operating-master-schema";
import MenuMaster from "@/schemas/menu-master-schema/menu-master-schema";
import RestaurantStaffMaster from "@/schemas/restaurant-staff-master-schema/restaurant-staff-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";
import RestaurantReservationApproval from "@/schemas/restaurant-reservation-approval-schema/restaurant-reservation-approval-schema";
import ReservationRuleMaster from "@/schemas/reservation-rule-master-schema/reservation-rule-master-schema";

export const restaurantReservationApprovalMasterRouter = express.Router();

// Helper filter for ID / ReservationNo
function buildFilter(id: string) {
  const conditions: any[] = [{ id }, { reservationNo: id }, { requestNo: id }];
  if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
    conditions.push({ _id: new mongoose.Types.ObjectId(id) });
  }
  return { $or: conditions };
}

// ================================================================
// AUTO-EXPIRE ENGINE
// Runs on every GET call — checks all "Approved" reservations
// If reservationDate+reservationTime + lateArrival grace period < now → Auto Expire
// ================================================================
async function runAutoExpireEngine(): Promise<void> {
  try {
    const now = new Date();

    // Fetch all currently "Approved" reservations
    const approvedReservations = await RestaurantReservationApproval.find({
      status: { $regex: /^approved$/i },
      isArchived: false,
    }).lean();

    for (const reservation of approvedReservations) {
      const r = reservation as any;

      // Build the reservation datetime from reservationDate + reservationTime
      // reservationDate is YYYY-MM-DD, reservationTime is HH:MM
      let reservationDateTime: Date | null = null;
      try {
        const datePart = r.reservationDate?.toString().substring(0, 10); // YYYY-MM-DD
        const timePart = r.reservationTime?.toString().substring(0, 5) || "00:00"; // HH:MM
        if (datePart) {
          reservationDateTime = new Date(`${datePart}T${timePart}:00`);
        }
      } catch (e) {
        continue;
      }

      if (!reservationDateTime || isNaN(reservationDateTime.getTime())) continue;

      // Fetch lateArrival grace period (minutes) from ReservationRuleMaster for this venue
      let lateArrivalMinutes = 30; // default 30 minutes
      if (r.venueId) {
        const rule = await ReservationRuleMaster.findOne({
          venueId: r.venueId,
          isActive: true,
          isArchived: false,
        }).lean();
        if ((rule as any)?.lateArrival) {
          lateArrivalMinutes = (rule as any).lateArrival;
        }
      }

      // Calculate the deadline: reservationTime + lateArrival grace period
      const deadlineMs = reservationDateTime.getTime() + (lateArrivalMinutes * 60 * 1000);
      const deadlineDate = new Date(deadlineMs);

      // If current time has passed the deadline → Auto Expire
      if (now > deadlineDate) {
        const expiredStatus = await CommonStatusMaster.findOne({
          $or: [
            { module: "Restaurant Reservation Approval" },
            { module: "Restaurant Reservation" },
            { module: "Restaurant Reservation Approval Master" },
          ],
          statusName: { $regex: /^expired$/i },
          isArchived: false,
        }).lean();
        const expiredStatusName = (expiredStatus as any)?.statusName ?? "Expired";

        const historyEntry = {
          action: expiredStatusName,
          approverId: "System",
          timestamp: new Date().toISOString(),
          remarks: `Auto-expired after ${lateArrivalMinutes}-min late arrival grace period. Deadline was ${deadlineDate.toLocaleString()}.`,
        };

        await RestaurantReservationApproval.findOneAndUpdate(
          buildFilter(r.id || r._id?.toString()),
          {
            $set: { status: expiredStatusName },
            $push: { approvalHistory: historyEntry },
          },
          { new: true, runValidators: false }
        ).exec();

        console.log(`[AutoExpire] Reservation ${r.reservationNo || r.id} auto-expired. Deadline: ${deadlineDate.toISOString()}`);
      }
    }
  } catch (err) {
    console.error("[AutoExpire] Error in auto-expire engine:", err);
  }
}

// ================================================================
// LOOKUP & MOBILE SPECIAL ROUTES (must come before /:id)
// ================================================================

// Venues accessible for a project (Mobile App venue browser)
restaurantReservationApprovalMasterRouter.get("/lookup/venues/:projectCode", async (req, res, next) => {
  try {
    const projectCode = req.params.projectCode;
    const projectVenues = await ProjectVenueMaster.find({
      projectCode,
      isActive: true,
      isArchived: false,
    }).lean();

    const allowedVenueIds = projectVenues.map((pv: any) => pv.venueId);
    const venues = await VenueMaster.find({
      $or: [{ projectCode }, { venueId: { $in: allowedVenueIds } }, { id: { $in: allowedVenueIds } }],
      isActive: true,
      isArchived: false,
    }).lean();

    return res.json({ success: true, data: venues });
  } catch (error) {
    next(error);
  }
});

// Operating hours for a venue
restaurantReservationApprovalMasterRouter.get("/lookup/operating-hours/:venueId", async (req, res, next) => {
  try {
    const venueId = req.params.venueId;
    const hours = await VenueOperatingMaster.find({
      $or: [{ venueId }, { id: venueId }],
      isActive: true,
      isArchived: false,
    }).lean();

    return res.json({ success: true, data: hours });
  } catch (error) {
    next(error);
  }
});

// Menus for a venue
restaurantReservationApprovalMasterRouter.get("/lookup/menus/:venueId", async (req, res, next) => {
  try {
    const venueId = req.params.venueId;
    const menus = await MenuMaster.find({
      $or: [{ venueId }, { id: venueId }],
      isActive: true,
      isArchived: false,
    }).lean();

    return res.json({ success: true, data: menus });
  } catch (error) {
    next(error);
  }
});

// Reservation Slot Rules for a venue
restaurantReservationApprovalMasterRouter.get("/lookup/rules/:venueId", async (req, res, next) => {
  try {
    const venueId = req.params.venueId;
    const rule = await ReservationRuleMaster.findOne({
      $or: [{ venueId }, { id: venueId }],
      isActive: true,
      isArchived: false,
    }).lean();

    return res.json({ success: true, data: rule ?? null });
  } catch (error) {
    next(error);
  }
});

// Status list driven by CommonStatusMaster
restaurantReservationApprovalMasterRouter.get("/lookup/statuses", async (req, res, next) => {
  try {
    let statuses = await CommonStatusMaster.find({
      $or: [
        { module: "Restaurant Reservation Approval" },
        { module: "Restaurant Reservation" },
        { module: "Restaurant Reservation Approval Master" },
      ],
      isArchived: false,
    })
      .sort({ sequence: 1 })
      .select("statusCode statusName sequence")
      .lean();

    if (statuses.length === 0) {
      statuses = [
        { statusCode: "PENDING", statusName: "Pending", sequence: 1 },
        { statusCode: "APPROVED", statusName: "Approved", sequence: 2 },
        { statusCode: "REJECTED", statusName: "Rejected", sequence: 3 },
        { statusCode: "ARRIVED", statusName: "Arrived", sequence: 4 },
        { statusCode: "EXPIRED", statusName: "Expired", sequence: 5 },
      ] as any;
    }

    return res.json({ success: true, data: statuses });
  } catch (error) {
    next(error);
  }
});

// Resident's own reservation requests (for mobile app)
restaurantReservationApprovalMasterRouter.get("/my-requests/:residentId", async (req, res, next) => {
  try {
    const result = await getRestaurantReservationApprovalService.execute({ residentId: req.params.residentId });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// Manual trigger: Auto-Expire check (can be called by a cron job or manually)
restaurantReservationApprovalMasterRouter.post("/auto-expire", async (req, res, next) => {
  try {
    await runAutoExpireEngine();
    return res.json({ success: true, message: "Auto-expire engine ran successfully." });
  } catch (error) {
    next(error);
  }
});

// ================================================================
// MAIN CRUD ROUTES
// ================================================================

// GET ALL — Web Portal list view (enriched & role-filtered by staff mapping)
// Also triggers the auto-expire engine on every GET call
restaurantReservationApprovalMasterRouter.get("/", async (req, res, next) => {
  try {
    // Auto-expire pass-due approved reservations before returning data
    await runAutoExpireEngine();

    const result = await getRestaurantReservationApprovalService.execute({
      isArchived: req.query.isArchived === "1",
      residentId: req.query.residentId as string | undefined,
      venueId: req.query.venueId as string | undefined,
      projectCode: req.query.projectCode as string | undefined,
      userId: req.query.userId as string | undefined,
    });
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// POST — Submit restaurant reservation request (Mobile App)
restaurantReservationApprovalMasterRouter.post("/", async (req, res, next) => {
  try {
    const input = combineRequestInput(req);
    const payload = req.body && Object.keys(req.body).length > 0 ? req.body : input;

    const result = await createRestaurantReservationApprovalService.execute(payload);

    if (!result.hasFailed()) {
      const created = result.getValue() as any;
      const staff = await RestaurantStaffMaster.find({
        $or: [{ venueId: created.venueId }, { projectCode: created.projectCode }],
        isActive: true,
        isArchived: false,
      }).lean();

      return res.status(200).json({
        success: true,
        data: {
          ...created,
          mappedStaff: staff.map((s: any) => ({
            id: s.id,
            approverRole: s.approverRole,
            role: s.role,
            venueId: s.venueId,
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

// GET SINGLE — by id or reservationNo
restaurantReservationApprovalMasterRouter.get("/:id", async (req, res, next) => {
  try {
    const result = await getSingleRestaurantReservationApprovalService.execute(req.params.id);
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// ================================================================
// APPROVAL / REJECTION / ARRIVAL ROUTES (Portal)
// ================================================================

// PATCH /:id — General update
restaurantReservationApprovalMasterRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body && Object.keys(req.body).length > 0 ? req.body : combineRequestInput(req);

    const payload = {
      ...body,
      id,
      _id: body._id || id,
    };

    const result = await updateRestaurantReservationApprovalService.execute(payload);
    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/approve — Explicit Approval Route (Sequence 2)
restaurantReservationApprovalMasterRouter.patch("/:id/approve", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    const approvedStatus = await CommonStatusMaster.findOne({
      $or: [
        { module: "Restaurant Reservation Approval" },
        { module: "Restaurant Reservation" },
        { module: "Restaurant Reservation Approval Master" },
      ],
      sequence: 2,
      isArchived: false,
    }).lean();
    const statusName = (approvedStatus as any)?.statusName ?? "Approved";

    const result = await updateRestaurantReservationApprovalService.execute({
      id,
      status: statusName,
      approverId: body.approverId ?? null,
      remarks: body.remarks ?? "Reservation approved by restaurant staff",
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/reject — Explicit Rejection Route (Sequence 3)
restaurantReservationApprovalMasterRouter.patch("/:id/reject", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};

    const rejectedStatus = await CommonStatusMaster.findOne({
      $or: [
        { module: "Restaurant Reservation Approval" },
        { module: "Restaurant Reservation" },
        { module: "Restaurant Reservation Approval Master" },
      ],
      sequence: 3,
      isArchived: false,
    }).lean();
    const statusName = (rejectedStatus as any)?.statusName ?? "Rejected";

    const reason = body.rejectionReason?.trim() || "Fully booked for requested slot";

    const result = await updateRestaurantReservationApprovalService.execute({
      id,
      status: statusName,
      rejectionReason: reason,
      approverId: body.approverId ?? null,
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});

// PATCH /:id/arrival — Arrival confirmation (Arrived / Not Arrived → Expired)
restaurantReservationApprovalMasterRouter.patch("/:id/arrival", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { isArrived, approverId } = req.body ?? {};

    const statusName = isArrived ? "Arrived" : "Expired";

    const result = await updateRestaurantReservationApprovalService.execute({
      id,
      status: statusName,
      approverId: approverId ?? null,
      remarks: isArrived
        ? "Guest arrival confirmed at restaurant"
        : "Guest did not arrive after late arrival grace period (Manual Expire by Staff)",
    });

    return presentResult(result, res);
  } catch (error) {
    next(error);
  }
});