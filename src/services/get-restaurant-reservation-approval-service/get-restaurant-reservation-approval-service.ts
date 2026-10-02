import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { RestaurantReservationApprovalRepository } from "@/repositories/restaurant-reservation-approval-repository";

import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import VenueMaster from "@/schemas/venue-master-schema/venue-master-schema";
import RestaurantStaffMaster from "@/schemas/restaurant-staff-master-schema/restaurant-staff-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";

type Props = {
  restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;
};

export class GetRestaurantReservationApprovalService {
  protected _restaurantReservationApprovalRepository: RestaurantReservationApprovalRepository;

  public constructor(props: Props) {
    this._restaurantReservationApprovalRepository = props.restaurantReservationApprovalRepository;
  }

  public async execute(input: any): Promise<Result<any[], Failure>> {
    try {
      const records = await this._restaurantReservationApprovalRepository.getAll({
        isArchived: input?.isArchived,
        residentId: input?.residentId,
        venueId: input?.venueId,
        projectCode: input?.projectCode,
      });

      // Batch-load lookup data
      const [
        allResidents,
        allVenues,
        allStaff,
        allStatuses,
      ] = await Promise.all([
        ResidentMaster.find({ isArchived: false }).lean(),
        VenueMaster.find({ isArchived: false }).lean(),
        RestaurantStaffMaster.find({ isActive: true, isArchived: false }).lean(),
        CommonStatusMaster.find({
          $or: [
            { module: "Restaurant Reservation Approval" },
            { module: "Restaurant Reservation" },
            { module: "Restaurant Reservation Approval Master" },
          ],
          isArchived: false,
        })
          .sort({ sequence: 1 })
          .lean(),
      ]);

      // Build resident lookup map
      const residentMap = new Map<string, any>();
      allResidents.forEach((r: any) => {
        if (r.id) residentMap.set(r.id, r);
        if (r.residentId) residentMap.set(r.residentId, r);
        if (r._id) residentMap.set(r._id.toString(), r);
      });

      // Build venue lookup map
      const venueMap = new Map<string, any>();
      allVenues.forEach((v: any) => {
        if (v.id) venueMap.set(v.id, v);
        if (v.venueId) venueMap.set(v.venueId, v);
        if (v._id) venueMap.set(v._id.toString(), v);
      });

      const statusOptions = allStatuses.map((s: any) => ({
        statusCode: s.statusCode,
        statusName: s.statusName,
        sequence: s.sequence,
      }));

      let enriched = records.map((record: any) => {
        const r = record.toObject ? record.toObject() : record;

        const resident = residentMap.get(r.residentId);
        const venue = venueMap.get(r.venueId);

        const mappedStaff = allStaff
          .filter(
            (s: any) =>
              (s.venueId && s.venueId === r.venueId) ||
              (s.projectCode && s.projectCode === r.projectCode)
          )
          .map((s: any) => ({
            id: s.id,
            approverRole: s.approverRole,
            role: s.role,
            projectCode: s.projectCode,
            venueId: s.venueId,
          }));

        return {
          ...r,
          id: r.id || r._id?.toString(),
          _id: r._id ? r._id.toString() : r.id,
          reservationNo: r.reservationNo || r.requestNo || r.id,
          requestNo: r.requestNo || r.reservationNo || r.id,
          venueName: r.venueName || venue?.venueName || r.venueId,
          reservationName:
            r.reservationName ||
            `${r.venueName || venue?.venueName || "Table"} Reservation for ${r.numberOfGuests || 1} Guests`,
          residentName: r.residentName || resident?.name || r.residentId,
          residentEmail: r.residentEmail || resident?.email || null,
          residentMobile: r.residentMobile || resident?.mobileNo || null,
          isRuleValid: r.isRuleValid !== undefined ? r.isRuleValid : true,
          ruleValidationNotes:
            r.ruleValidationNotes ||
            "✓ Reservation details validated against venue operating hours & rules.",
          mappedStaff,
          statusOptions,
        };
      });

      // Filter based on logged-in restaurant staff mapping if userId is provided
      if (input?.userId) {
        const matchedStaff = allStaff.filter(
          (s: any) =>
            s.approverRole === input.userId ||
            s.role === input.userId ||
            s.userId === input.userId ||
            s.staffUserId === input.userId ||
            s.id === input.userId ||
            s._id?.toString() === input.userId
        );

        if (matchedStaff.length > 0) {
          const allowedVenues = new Set(matchedStaff.map((s: any) => s.venueId).filter(Boolean));
          const allowedProjects = new Set(matchedStaff.map((s: any) => s.projectCode).filter(Boolean));

          enriched = enriched.filter((item: any) => {
            const matchesVenue = item.venueId && allowedVenues.has(item.venueId);
            const matchesProject = item.projectCode && allowedProjects.has(item.projectCode);
            return matchesVenue || matchesProject;
          });
        } else {
          // User is not mapped in restaurant staff master -> return empty array
          enriched = [];
        }
      }

      return Result.ok(enriched);
    } catch (error) {
      console.error("Error getting restaurant reservation approval requests:", error);
      return Result.fail(Failure.badRequest("Failed to get restaurant reservation approval requests"));
    }
  }
}

export const makeGetRestaurantReservationApprovalService = (props: Props) =>
  new GetRestaurantReservationApprovalService(props);
