import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtOperatingMaster } from "@/schemas/court-operating-master-schema";
import { SessionRecord } from "@/records/session-record";
import { CourtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

type Props = {
  courtOperatingMasterRepository: CourtOperatingMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetCourtOperatingMasterService {
  protected _courtOperatingMasterRepository: CourtOperatingMasterRepository;

  public constructor(props: Props) {
    this._courtOperatingMasterRepository =
      props.courtOperatingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtOperatingMaster[], Failure>> {
    const isArchived =
      input.isArchived === true ||
      input.isArchived === "1" ||
      input.isArchived === "true";

    const properties =
      await this._courtOperatingMasterRepository.getAll({
        isArchived,
      });

    const mappedProperties: ICourtOperatingMaster[] = properties.map(
      (item) => {
        const doc =
          typeof (item as any).toObject === "function"
            ? (item as any).toObject()
            : { ...item };

        const isActive =
          typeof doc.isActive !== "undefined"
            ? Boolean(doc.isActive)
            : true;

        return {
          ...doc,
          isActive,
        } as ICourtOperatingMaster;
      }
    );

    return Result.ok(mappedProperties);
  }
}