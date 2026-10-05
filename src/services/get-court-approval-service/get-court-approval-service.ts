import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { courtApprovalRepository } from "@/repositories/court-approval-repository";
import { ICourtApproval } from "@/schemas/court-approval-schema/court-approval-schema";
import FacilityApprovalMaster from "@/schemas/facility-approval-master-schema/facility-approval-master-schema";

export class GetCourtApprovalService {
  public async execute(filter: {
    isArchived?: boolean;
    residentId?: string;
    courtId?: string;
    projectCode?: string;
    userId?: string;
    status?: string;
  }): Promise<Result<ICourtApproval[], Failure>> {
    try {
      const query: any = {
        isArchived: filter.isArchived ?? false,
      };

      if (filter.residentId) {
        query.residentId = filter.residentId;
      }
      if (filter.courtId) {
        query.courtId = filter.courtId;
      }
      if (filter.status) {
        query.status = filter.status;
      }

      // Facility Approver Role/User filtering
      if (filter.userId && filter.userId !== "superadmin") {
        const mappedProjects = await FacilityApprovalMaster.find({
          $or: [{ approverRole: filter.userId }, { projectCode: filter.userId }],
          isActive: true,
          isArchived: false,
        })
          .select("projectCode")
          .lean();

        if (mappedProjects.length > 0) {
          const allowedProjects = mappedProjects.map((p: any) => p.projectCode);
          query.projectCode = { $in: allowedProjects };
        } else if (filter.projectCode) {
          query.projectCode = filter.projectCode;
        }
      } else if (filter.projectCode) {
        query.projectCode = filter.projectCode;
      }

      const records = await courtApprovalRepository.find(query);
      return Result.ok(records);
    } catch (error) {
      console.error("Error fetching court approvals:", error);
      return Result.fail(Failure.badRequest("Failed to fetch court approvals"));
    }
  }
}

export const getCourtApprovalService = new GetCourtApprovalService();
