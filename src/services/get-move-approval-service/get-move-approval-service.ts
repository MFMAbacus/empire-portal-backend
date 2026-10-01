import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { MoveApprovalRepository } from "@/repositories/move-approval-repository";

import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema/apartment-master-schema";
import MovementTypeMaster from "@/schemas/movement-type-master-schema/movement-type-master-schema";
import ItemTypeMaster from "@/schemas/item-type-master-schema/item-type-master-schema";
import PropertyManagementApprovalMaster from "@/schemas/property-management-approval-master-schema/property-management-approval-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";

type Props = {
  moveApprovalRepository: MoveApprovalRepository;
};

export class GetMoveApprovalService {
  protected _moveApprovalRepository: MoveApprovalRepository;

  public constructor(props: Props) {
    this._moveApprovalRepository = props.moveApprovalRepository;
  }

  public async execute(input: any): Promise<Result<any[], Failure>> {
    try {
      const records = await this._moveApprovalRepository.getAll({
        isArchived: input?.isArchived,
        residentId: input?.residentId,
      });

      // Batch-load all lookup tables
      const [
        allResidents,
        allApartments,
        allMovementTypes,
        allItemTypes,
        allApprovers,
        allStatuses,
      ] = await Promise.all([
        ResidentMaster.find({ isArchived: false }).lean(),
        ApartmentMaster.find({ isArchived: false }).lean(),
        MovementTypeMaster.find({ isArchived: false }).lean(),
        ItemTypeMaster.find({ isArchived: false }).lean(),
        PropertyManagementApprovalMaster.find({ isActive: true, isArchived: false }).lean(),
        CommonStatusMaster.find({ module: "Move Approval", isArchived: false })
          .sort({ sequence: 1 })
          .lean(),
      ]);

      // Build lookup maps
      const residentMap = new Map<string, any>();
      allResidents.forEach((r: any) => {
        if (r.id) residentMap.set(r.id, r);
        if (r.residentId) residentMap.set(r.residentId, r);
        if (r._id) residentMap.set(r._id.toString(), r);
      });

      const apartmentMap = new Map<string, any>();
      allApartments.forEach((a: any) => {
        if (a.id) apartmentMap.set(a.id, a);
        if (a.apartmentId) apartmentMap.set(a.apartmentId, a);
        if (a._id) apartmentMap.set(a._id.toString(), a);
      });

      const movementTypeMap = new Map<string, any>();
      allMovementTypes.forEach((m: any) => {
        if (m.id) movementTypeMap.set(m.id, m);
        if (m.movementTypeId) movementTypeMap.set(m.movementTypeId, m);
        if (m._id) movementTypeMap.set(m._id.toString(), m);
      });

      const itemTypeMap = new Map<string, any>();
      allItemTypes.forEach((i: any) => {
        if (i.id) itemTypeMap.set(i.id, i);
        if (i.itemTypeId) itemTypeMap.set(i.itemTypeId, i);
        if (i._id) itemTypeMap.set(i._id.toString(), i);
      });

      // Status options for portal display
      const statusOptions = allStatuses.map((s: any) => ({
        statusCode: s.statusCode,
        statusName: s.statusName,
        sequence: s.sequence,
      }));

      let enriched = records.map((record: any) => {
        const r = record.toObject ? record.toObject() : record;

        const resident = residentMap.get(r.residentId);
        const apartment = apartmentMap.get(r.apartmentId);
        const movementType = movementTypeMap.get(r.movementTypeId);
        const itemType = itemTypeMap.get(r.itemTypeId);

        // Approvers mapped to this project
        const projectApprovers = allApprovers
          .filter((a: any) => a.projectCode === r.projectCode)
          .map((a: any) => ({ id: a.id, approverRole: a.approverRole, projectCode: a.projectCode }));

        return {
          ...r,
          id: r.id || r._id.toString(),
          _id: r._id ? r._id.toString() : r.id,
          residentName: resident?.name ?? r.residentId,
          residentEmail: resident?.email ?? null,
          residentMobile: resident?.mobileNo ?? null,
          apartmentNo: apartment?.apartmentNo ?? r.apartmentId,
          apartmentBuilding: apartment?.buildingOrTower ?? null,
          movementTypeName: movementType?.type ?? r.movementTypeId,
          itemTypeName: itemType?.itemTypeName ?? r.itemTypeId,
          projectApprovers,
          statusOptions,
        };
      });

      // Filter records based on logged-in Property Management Approver if userId is provided
      if (input?.userId) {
        const matchedApprovers = allApprovers.filter(
          (a: any) =>
            a.userId === input.userId ||
            a.id === input.userId ||
            a._id?.toString() === input.userId ||
            a.approverRole === input.userId ||
            a.role === input.userId
        );

        if (matchedApprovers.length > 0) {
          const allowedProjectCodes = matchedApprovers.map((a: any) => a.projectCode);
          enriched = enriched.filter((item: any) => allowedProjectCodes.includes(item.projectCode));
        } else {
          // If the user is not a registered property management approver for any project, return empty list
          enriched = [];
        }
      }

      return Result.ok(enriched);
    } catch (error) {
      console.error("Error getting move approval requests:", error);
      return Result.fail(Failure.badRequest("Failed to get move approval requests"));
    }
  }
}
