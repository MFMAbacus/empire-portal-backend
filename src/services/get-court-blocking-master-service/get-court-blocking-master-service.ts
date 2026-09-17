import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtBlockingMaster } from "@/schemas/court-blocking-master-schema";
import { SessionRecord } from "@/records/session-record";
import { CourtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

type Props = {
  courtBlockingMasterRepository: CourtBlockingMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetCourtBlockingMasterService {
  protected _courtBlockingMasterRepository: CourtBlockingMasterRepository;

  public constructor(props: Props) {
    this._courtBlockingMasterRepository = props.courtBlockingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtBlockingMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._courtBlockingMasterRepository.getAll({ isArchived });

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
