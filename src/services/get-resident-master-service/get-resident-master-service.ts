import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IResidentMaster } from "@/schemas/resident-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ResidentMasterRepository } from "@/repositories/resident-master-repository";

type Props = {
  residentMasterRepository: ResidentMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetResidentMasterService {
  protected _residentMasterRepository: ResidentMasterRepository;

  public constructor(props: Props) {
    this._residentMasterRepository = props.residentMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IResidentMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._residentMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
