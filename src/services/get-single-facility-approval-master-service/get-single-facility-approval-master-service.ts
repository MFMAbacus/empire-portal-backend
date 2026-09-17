import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IFacilityApprovalMaster } from "@/schemas/facility-approval-master-schema";
import { FacilityApprovalMasterRepository } from "@/repositories/facility-approval-master-repository";

type Props = {
  facilityApprovalMasterRepository: FacilityApprovalMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleFacilityApprovalMasterService {
  protected _facilityApprovalMasterRepository: FacilityApprovalMasterRepository;

  public constructor(props: Props) {
    this._facilityApprovalMasterRepository = props.facilityApprovalMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IFacilityApprovalMaster, Failure>> {
    const record = await this._facilityApprovalMasterRepository.get(input.id);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (record as any).toObject === "function" ? (record as any).toObject() : { ...record };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}