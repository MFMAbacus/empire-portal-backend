import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IFacilityApprovalMaster } from "@/schemas/facility-approval-master-schema";
import { SessionRecord } from "@/records/session-record";
import { FacilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

type Props = {
  facilityApprovalMasterRepository: FacilityApprovalMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetFacilityApprovalMasterService {
  protected _facilityApprovalMasterRepository: FacilityApprovalMasterRepository;

  public constructor(props: Props) {
    this._facilityApprovalMasterRepository = props.facilityApprovalMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IFacilityApprovalMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const coordinators = await this._facilityApprovalMasterRepository.getAll({ isArchived });

    const mappedCoordinators = coordinators.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedCoordinators as any);
  }
}