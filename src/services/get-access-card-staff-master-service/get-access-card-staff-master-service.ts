import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IAccessCardStaffMaster } from "@/schemas/access-card-staff-master-schema";
import { SessionRecord } from "@/records/session-record";
import { AccessCardStaffMasterRepository } from "@/repositories/access-card-staff-master-repository";

type Props = {
  accessCardStaffMasterRepository: AccessCardStaffMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetAccessCardStaffMasterService {
  protected _accessCardStaffMasterRepository: AccessCardStaffMasterRepository;

  public constructor(props: Props) {
    this._accessCardStaffMasterRepository = props.accessCardStaffMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IAccessCardStaffMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const coordinators = await this._accessCardStaffMasterRepository.getAll({ isArchived });

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