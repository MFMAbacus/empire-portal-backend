import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { courtApprovalRepository } from "@/repositories/court-approval-repository";
import CourtApproval, { ICourtApproval } from "@/schemas/court-approval-schema/court-approval-schema";
import CourtMaster from "@/schemas/court-master-schema/court-master-schema";
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ProjectCourtMaster from "@/schemas/project-court-master-schema/project-court-master-schema";
import CourtOperatingMaster from "@/schemas/court-operating-master-schema/court-operating-master-schema";
import CourtBlockingMaster from "@/schemas/court-blocking-master-schema/court-blocking-master-schema";
import FacilityApprovalMaster from "@/schemas/facility-approval-master-schema/facility-approval-master-schema";
import CourtBookingMaster from "@/schemas/court-booking-master-schema/court-booking-master-schema";

async function generateSequentialReservationNo(): Promise<string> {
  const records = await CourtApproval.find({
    $or: [{ reservationNo: /^CR-\d+$/ }, { requestNo: /^CR-\d+$/ }],
  })
    .select("reservationNo requestNo")
    .lean();

  let maxSeq = 0;
  for (const r of records) {
    const numStr = r.reservationNo || r.requestNo;
    if (numStr) {
      const match = numStr.match(/^CR-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const formatted = String(nextSeq).padStart(6, "0");
  return `CR-${formatted}`;
}

async function validateCourtReservationRule(payload: any): Promise<{ hasViolation: boolean; violationDetails: string }> {
  const violations: string[] = [];
  let isViolated = false;

  // 1. Fetch Project Booking Rules (Max booking duration in hours & Advance booking days)
  if (payload.projectCode) {
    const rule = await CourtBookingMaster.findOne({
      $or: [{ projectCode: payload.projectCode }, { id: payload.projectCode }],
      isArchived: false,
      isActive: true,
    }).lean();

    if (rule) {
      const r = rule as any;
      // Max Duration Limit Check (Max booking duration in hours)
      if (payload.duration && r.maxBooking) {
        let durationInHours = 0;
        const durStr = payload.duration.toString().toLowerCase();
        if (durStr.includes("hour")) {
          durationInHours = parseFloat(durStr);
        } else if (durStr.includes("min")) {
          durationInHours = parseFloat(durStr) / 60;
        } else {
          const val = parseFloat(durStr);
          durationInHours = val > 12 ? val / 60 : val;
        }

        if (!isNaN(durationInHours) && durationInHours > r.maxBooking) {
          isViolated = true;
          violations.push(`Requested duration (${payload.duration}) exceeds project max limit of ${r.maxBooking} hours.`);
        }
      }

      // Advance Booking Limit Check
      if (payload.bookingDate && r.advanceBooking) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bDate = new Date(payload.bookingDate);
        bDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((bDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > r.advanceBooking) {
          isViolated = true;
          violations.push(`Booking date is ${diffDays} days in advance, exceeding max advance booking rule of ${r.advanceBooking} days.`);
        }
      }
    }
  }

  // 2. Project-Court Access Mapping Check
  if (payload.courtId && payload.projectCode) {
    const mapping = await ProjectCourtMaster.findOne({
      $or: [{ courtId: payload.courtId }, { id: payload.courtId }],
      projectCode: payload.projectCode,
      isArchived: false,
    }).lean();

    if (mapping && (mapping as any).isAccess === false) {
      isViolated = true;
      violations.push(`Project '${payload.projectCode}' does not have access to Court '${payload.courtId}'.`);
    }
  }

  // 3. Court Operating Hours Check
  if (payload.courtId && payload.bookingDate) {
    try {
      const dateObj = new Date(payload.bookingDate);
      if (!isNaN(dateObj.getTime())) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[dateObj.getDay()];

        const operatingHour = await CourtOperatingMaster.findOne({
          $or: [{ courtId: payload.courtId }, { id: payload.courtId }],
          day: { $regex: new RegExp(`^${dayName}$`, "i") },
          isArchived: false,
        }).lean();

        if (operatingHour) {
          const op = operatingHour as any;
          if (op.isClosed) {
            isViolated = true;
            violations.push(`Court is closed on ${dayName}s (Operating Hours Master).`);
          }
        }
      }
    } catch (e) {
      console.warn("Date check warning", e);
    }
  }

  // 4. Maintenance / PT Court Blocking Check
  if (payload.courtId && payload.bookingDate) {
    const blocks = await CourtBlockingMaster.find({
      $or: [{ courtId: payload.courtId }, { id: payload.courtId }],
      blockDate: payload.bookingDate,
      isActive: true,
      isArchived: false,
    }).lean();

    if (blocks.length > 0) {
      for (const b of blocks as any[]) {
        if (payload.timeSlot && b.startTime && b.endTime) {
          const blockSlotStr = `${b.startTime} - ${b.endTime}`;
          if (payload.timeSlot.includes(b.startTime) || payload.timeSlot === blockSlotStr) {
            isViolated = true;
            violations.push(`Slot clashes with Maintenance/PT Session Block (${b.reason || "Slot Blocked"}).`);
            break;
          }
        }
      }
    }
  }

  // 5. Existing Reserved / Pending Blocked Slots Collision Check
  if (payload.courtId && payload.bookingDate && payload.timeSlot) {
    const existingBooking = await CourtApproval.findOne({
      courtId: payload.courtId,
      bookingDate: payload.bookingDate,
      timeSlot: payload.timeSlot,
      status: { $in: ["Pending Blocked", "Approved", "Maintenance Blocked", "PT Session Blocked"] },
      isArchived: false,
    }).lean();

    if (existingBooking) {
      isViolated = true;
      violations.push(`Requested slot '${payload.timeSlot}' is already locked/reserved by Booking ${(existingBooking as any).reservationNo}.`);
    }
  }

  const details = violations.length > 0 ? violations.join(" | ") : "✓ Booking complies with court rules, operating hours, and project settings.";

  return {
    hasViolation: isViolated,
    violationDetails: details,
  };
}

export class CreateCourtApprovalService {
  public async execute(input: any): Promise<Result<ICourtApproval, Failure>> {
    try {
      const payload: any = { ...input };

      // Generate sequential CR reservation number
      const seqNo = await generateSequentialReservationNo();
      payload.id = seqNo;
      payload.reservationNo = seqNo;
      payload.requestNo = seqNo;

      // Lookup court details
      if (payload.courtId) {
        const court = await CourtMaster.findOne({
          $or: [{ id: payload.courtId }, { courtId: payload.courtId }],
          isArchived: false,
        }).lean();

        if (court) {
          const c = court as any;
          if (!payload.courtName) payload.courtName = c.courtName;
          if (!payload.courtType) payload.courtType = c.courtType;
          if (!payload.projectCode) payload.projectCode = c.projectCode;
        }
      }

      // Lookup resident details
      if (payload.residentId) {
        const resident = await ResidentMaster.findOne({
          $or: [{ id: payload.residentId }, { residentId: payload.residentId }],
          isArchived: false,
        }).lean();

        if (resident) {
          const r = resident as any;
          if (!payload.residentName) payload.residentName = r.name || r.residentName || r.fullName;
          if (!payload.residentEmail) payload.residentEmail = r.email || r.residentEmail;
          if (!payload.residentMobile) payload.residentMobile = r.mobileNo || r.mobile || r.phone;
          if (!payload.apartmentNo) payload.apartmentNo = r.apartmentNo || r.unitNo || r.apartment;
          if (!payload.projectCode && r.projectCode) payload.projectCode = r.projectCode;
        }
      }

      if (!payload.projectCode) payload.projectCode = "PRJ-MAIN";
      if (!payload.reservationName) {
        payload.reservationName = `${payload.courtName || "Court"} Reservation - ${payload.residentName || "Resident"}`;
      }
      if (!payload.duration) payload.duration = "1 hour";

      // Enforce immediate pending slot blocking
      payload.status = payload.status || "Pending Blocked";
      payload.slotStatus = payload.status;

      // Rule Validation & Violation Check
      const ruleRes = await validateCourtReservationRule(payload);
      payload.hasViolation = ruleRes.hasViolation;
      payload.violationDetails = ruleRes.violationDetails;

      payload.active = payload.active !== undefined ? payload.active : true;
      payload.approvalHistory = [
        {
          action: payload.status,
          approverId: payload.residentId || "Resident",
          timestamp: new Date().toISOString(),
          remarks: `Court reservation request submitted (${payload.status}). Slot locked immediately.`,
        },
      ];

      // Route approval to Facility Approver mapping
      const approvers = await FacilityApprovalMaster.find({
        projectCode: payload.projectCode,
        isArchived: false,
        isActive: true,
      }).lean();

      const createdRecord = await courtApprovalRepository.create(payload as ICourtApproval);
      const cleanData = createdRecord.toObject ? createdRecord.toObject() : createdRecord;
      return Result.ok(cleanData);
    } catch (error) {
      console.error("Error creating court reservation:", error);
      return Result.fail(Failure.badRequest("Failed to create court reservation"));
    }
  }
}

export const createCourtApprovalService = new CreateCourtApprovalService();
