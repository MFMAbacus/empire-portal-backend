import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { RestaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";
import { IRestaurantReservationApproval } from "@/schemas/restaurant-reservation-approval-schema";

import RestaurantReservationApproval from "@/schemas/restaurant-reservation-approval-schema/restaurant-reservation-approval-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";
import VenueMaster from "@/schemas/venue-master-schema/venue-master-schema";
import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ProjectVenueMaster from "@/schemas/project-venue-master-schema/project-venue-master-schema";
import VenueOperatingMaster from "@/schemas/venue-operating-master-schema/venue-operating-master-schema";
import ReservationRuleMaster from "@/schemas/reservation-rule-master-schema/reservation-rule-master-schema";
import RestaurantStaffMaster from "@/schemas/restaurant-staff-master-schema/restaurant-staff-master-schema";

type Props = {
  restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;
};

async function generateSequentialReservationNo(): Promise<string> {
  const records = await RestaurantReservationApproval.find({
    $or: [{ reservationNo: /^RR-\d+$/ }, { requestNo: /^RR-\d+$/ }],
  })
    .select("reservationNo requestNo")
    .lean();

  let maxSeq = 0;
  for (const r of records) {
    const numStr = r.reservationNo || r.requestNo;
    if (numStr) {
      const match = numStr.match(/^RR-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const formatted = String(nextSeq).padStart(6, "0");
  return `RR-${formatted}`;
}

async function validateReservationRule(payload: any): Promise<{ isRuleValid: boolean; ruleValidationNotes: string }> {
  const notes: string[] = [];
  let isValid = true;

  // 1. Project-Venue Mapping Check
  if (payload.venueId && payload.projectCode) {
    const projectVenue = await ProjectVenueMaster.findOne({
      venueId: payload.venueId,
      projectCode: payload.projectCode,
      isArchived: false,
    }).lean();

    if (projectVenue && (projectVenue as any).isAccess === false) {
      isValid = false;
      notes.push(`Project '${payload.projectCode}' does not have access to venue '${payload.venueId}' (Project-Venue Mapping disabled).`);
    }
  }

  // 2. Venue Operating Hours Check
  if (payload.venueId && payload.reservationDate) {
    try {
      const dateObj = new Date(payload.reservationDate);
      if (!isNaN(dateObj.getTime())) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[dateObj.getDay()];

        const operatingHour = await VenueOperatingMaster.findOne({
          venueId: payload.venueId,
          day: { $regex: new RegExp(`^${dayName}$`, "i") },
          isArchived: false,
        }).lean();

        if (operatingHour) {
          const op = operatingHour as any;
          if (op.isClosed) {
            isValid = false;
            notes.push(`Venue '${payload.venueName || payload.venueId}' is closed on ${dayName}s.`);
          } else if (op.openTime && op.closeTime && payload.reservationTime) {
            const resTime = payload.reservationTime;
            if (resTime < op.openTime || resTime > op.closeTime) {
              isValid = false;
              notes.push(`Reservation time ${resTime} is outside operating hours (${op.openTime} – ${op.closeTime}) on ${dayName}.`);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Date parse error during rule validation", e);
    }
  }

  // 3. Reservation Slot & Max Guest Rule Check
  if (payload.venueId) {
    const rule = await ReservationRuleMaster.findOne({
      venueId: payload.venueId,
      isArchived: false,
      isActive: true,
    }).lean();

    if (rule) {
      const r = rule as any;
      if (r.maxGuest && payload.numberOfGuests > r.maxGuest) {
        isValid = false;
        notes.push(`Guest count (${payload.numberOfGuests}) exceeds maximum allowed capacity (${r.maxGuest}) for this venue.`);
      }
    }
  }

  // 4. Restaurant Staff Mapping Check
  if (payload.venueId || payload.projectCode) {
    const staffCount = await RestaurantStaffMaster.countDocuments({
      $or: [{ venueId: payload.venueId }, { projectCode: payload.projectCode }],
      isArchived: false,
      isActive: true,
    }).exec();

    if (staffCount === 0) {
      notes.push(`Notice: No restaurant staff currently mapped for venue '${payload.venueId}'.`);
    }
  }

  if (isValid && notes.length === 0) {
    notes.push("✓ Reservation details validated successfully against operating hours, guest limits, and project mapping.");
  }

  return {
    isRuleValid: isValid,
    ruleValidationNotes: notes.join(" | "),
  };
}

export class CreateRestaurantReservationApprovalService {
  protected _restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;

  public constructor(props: Props) {
    this._restaurantReservationApprovalRepository = props.restaurantReservationApprovalRepository;
  }

  public async execute(input: any): Promise<Result<IRestaurantReservationApproval, Failure>> {
    try {
      const payload: any = { ...input };

      // Generate sequential reservation number
      const seqNo = await generateSequentialReservationNo();
      payload.id = seqNo;
      payload.reservationNo = seqNo;
      payload.requestNo = seqNo;

      // Auto-Lookup venue details (venueName, projectCode)
      if (payload.venueId) {
        const venue = await VenueMaster.findOne({
          $or: [{ id: payload.venueId }, { venueId: payload.venueId }],
          isArchived: false,
        }).lean();
        if (venue) {
          if (!payload.venueName) {
            payload.venueName = (venue as any).venueName || (venue as any).name;
          }
          if (!payload.projectCode) {
            payload.projectCode = (venue as any).projectCode;
          }
        }
      }

      // Auto-Lookup resident details (residentName, residentEmail, residentMobile, projectCode)
      if (payload.residentId) {
        const resident = await ResidentMaster.findOne({
          $or: [{ id: payload.residentId }, { residentId: payload.residentId }],
          isArchived: false,
        }).lean();
        if (resident) {
          const res = resident as any;
          if (!payload.residentName) {
            payload.residentName = res.name || res.residentName || res.fullName;
          }
          if (!payload.residentEmail) {
            payload.residentEmail = res.email || res.residentEmail;
          }
          if (!payload.residentMobile) {
            payload.residentMobile = res.mobileNo || res.mobile || res.phone;
          }
          if (!payload.projectCode && (res.projectCode || res.projectId)) {
            payload.projectCode = res.projectCode || res.projectId;
          }
        }
      }

      // Default projectCode fallback if still empty
      if (!payload.projectCode) {
        payload.projectCode = "PRJ-MAIN";
      }

      // Validate Business Rules (Operating Hours, Slot Rules, Project Mapping, Staff Mapping)
      const ruleResult = await validateReservationRule(payload);
      payload.isRuleValid = ruleResult.isRuleValid;
      payload.ruleValidationNotes = ruleResult.ruleValidationNotes;

      // Dynamic initial status from CommonStatusMaster sequence 1
      const initialStatusDoc = await CommonStatusMaster.findOne({
        $or: [
          { module: "Restaurant Reservation Approval" },
          { module: "Restaurant Reservation" },
          { module: "Restaurant Reservation Approval Master" },
        ],
        sequence: 1,
        isArchived: false,
      }).lean();

      payload.status = (initialStatusDoc as any)?.statusName ?? "Pending";
      payload.active = payload.active !== undefined ? payload.active : true;
      payload.approvalHistory = [
        {
          action: payload.status,
          approverId: payload.residentId || "Resident",
          timestamp: new Date().toISOString(),
          remarks: "Reservation request submitted by resident",
        },
      ];

      await this._restaurantReservationApprovalRepository.Create(payload as IRestaurantReservationApproval);
      return Result.ok(payload as IRestaurantReservationApproval);
    } catch (error) {
      console.error("Error creating restaurant reservation approval request:", error);
      return Result.fail(Failure.badRequest("Failed to create restaurant reservation approval request"));
    }
  }
}

export const makeCreateRestaurantReservationApprovalService = (props: Props) =>
  new CreateRestaurantReservationApprovalService(props);
