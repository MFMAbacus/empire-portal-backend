import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IGuardAccountMappingMaster } from "@/schemas/guard-account-mapping-master-schema";
import { SessionRecord } from "@/records/session-record";
import { GuardAccountMappingMasterRepository } from "@/repositories/guard-account-mapping-master-repository";

type Props = {
  guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetGuardAccountMappingMasterService {
  protected _guardAccountMappingMasterRepository: GuardAccountMappingMasterRepository;

  public constructor(props: Props) {
    this._guardAccountMappingMasterRepository = props.guardAccountMappingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IGuardAccountMappingMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._guardAccountMappingMasterRepository.getAll({ isArchived });

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
