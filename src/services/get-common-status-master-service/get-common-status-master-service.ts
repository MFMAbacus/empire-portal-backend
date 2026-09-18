import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICommonStatusMaster } from "@/schemas/common-status-master-schema";
import { SessionRecord } from "@/records/session-record";
import { CommonStatusMasterRepository } from "@/repositories/common-status-master-repository";

type Props = {
  commonStatusMasterRepository: CommonStatusMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetCommonStatusMasterService {
  protected _commonStatusMasterRepository: CommonStatusMasterRepository;

  public constructor(props: Props) {
    this._commonStatusMasterRepository = props.commonStatusMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICommonStatusMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._commonStatusMasterRepository.getAll({ isArchived });

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
