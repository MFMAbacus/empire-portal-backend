import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GuestAccessRepository } from "@/repositories/guest-access-repository";

import ResidentMaster from "@/schemas/resident-master-schema/resident-master-schema";
import ApartmentMaster from "@/schemas/apartment-master-schema/apartment-master-schema";
import PropertyMaster from "@/schemas/property-master-schema/property-master-schema";
import VehicleTypeMaster from "@/schemas/vehicle-type-master-schema/vehicle-type-master-schema";
import GateMaster from "@/schemas/gate-master-schema/gate-master-schema";
import CommonStatusMaster from "@/schemas/common-status-master-schema/common-status-master-schema";
import ApprovalRoutingMaster from "@/schemas/approval-routing-master-schema/approval-routing-master-schema";
import SecurityCoordinatorMaster from "@/schemas/security-coordinator-master-schema/security-coordinator-master-schema";

type Props = {
  guestAccessRepository: GuestAccessRepository;
};

export class GetSingleGuestAccessService {
  protected _guestAccessRepository: GuestAccessRepository;

  public constructor(props: Props) {
    this._guestAccessRepository = props.guestAccessRepository;
  }

  public async execute(id: string): Promise<Result<any, Failure>> {
    try {
      const record = await this._guestAccessRepository.get(id);
      if (!record) return Result.fail(Failure.notFound());

      const r = record.toObject ? record.toObject() : record;

      // Load all related data in parallel
      const [
        resident,
        apartment,
        project,
        vehicleTypeObj,
        assignedGate,
        projectGates,
        approvalRouting,
        securityCoordinators,
        approvalStatusOptions,
      ] = await Promise.all([
        ResidentMaster.findOne({ id: r.residentId }).lean(),
        ApartmentMaster.findOne({ id: r.apartmentId }).lean(),
        PropertyMaster.findOne({ projectCode: r.projectCode }).lean(),
        r.vehicleType ? VehicleTypeMaster.findOne({ id: r.vehicleType }).lean() : Promise.resolve(null),
        r.assignedGateId ? GateMaster.findOne({ id: r.assignedGateId }).lean() : Promise.resolve(null),
        GateMaster.find({ projectCode: r.projectCode, isActive: true, isArchived: false }).lean(),
        ApprovalRoutingMaster.find({ module: "Guest Access", projectCode: r.projectCode, isActive: true, isArchived: false }).lean(),
        SecurityCoordinatorMaster.find({ projectCode: r.projectCode, isActive: true, isArchived: false }).lean(),
        CommonStatusMaster.find({ module: "Guest Access", isArchived: false }).sort({ sequence: 1 }).lean(),
      ]);

      const enriched = {
        ...r,
        residentName: (resident as any)?.name ?? r.residentId,
        residentEmail: (resident as any)?.email ?? null,
        residentMobile: (resident as any)?.mobileNo ?? null,
        apartmentNo: (apartment as any)?.apartmentNo ?? r.apartmentId,
        apartmentBuilding: (apartment as any)?.buildingOrTower ?? null,
        apartmentFloor: (apartment as any)?.floor ?? null,
        projectName: (project as any)?.projectName ?? r.projectCode,
        vehicleTypeName: (vehicleTypeObj as any)?.vehicleType ?? r.vehicleType,
        assignedGateName: (assignedGate as any)?.gateName ?? null,
        availableGates: projectGates.map((g: any) => ({ id: g.id, gateName: g.gateName, location: g.location })),
        approvalRouting: approvalRouting.map((ar: any) => ({ role: ar.approverRole, level: ar.approvalLevel })),
        securityCoordinators: securityCoordinators.map((sc: any) => ({ role: sc.coordinatorRole, projectCode: sc.projectCode })),
        approvalStatusOptions: approvalStatusOptions.map((s: any) => ({ statusCode: s.statusCode, statusName: s.statusName, sequence: s.sequence })),
      };

      return Result.ok(enriched);
    } catch (error) {
      return Result.fail(Failure.badRequest("Failed to get guest request"));
    }
  }
}
