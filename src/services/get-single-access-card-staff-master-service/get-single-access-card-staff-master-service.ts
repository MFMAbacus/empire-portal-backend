import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IAccessCardStaffMaster } from "@/schemas/access-card-staff-master-schema";
import { AccessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

type Props = {
  accessCardStaffMasterRepository: AccessCardStaffMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleAccessCardStaffMasterService {
  protected _accessCardStaffMasterRepository: AccessCardStaffMasterRepository;

  public constructor(props: Props) {
    this._accessCardStaffMasterRepository = props.accessCardStaffMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IAccessCardStaffMaster, Failure>> {
    const record = await this._accessCardStaffMasterRepository.get(input.id);
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