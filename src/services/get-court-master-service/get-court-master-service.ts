import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtMaster } from "@/schemas/court-master-schema";
import { SessionRecord } from "@/records/session-record";
import { CourtMasterRepository } from "@/repositories/court-master-repository";

type Props = {
  courtMasterRepository: CourtMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetCourtMasterService {
  protected _courtMasterRepository: CourtMasterRepository;

  public constructor(props: Props) {
    this._courtMasterRepository = props.courtMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._courtMasterRepository.getAll({ isArchived });

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
