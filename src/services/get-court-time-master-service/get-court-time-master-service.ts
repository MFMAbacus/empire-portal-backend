import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtTimeMaster } from "@/schemas/court-time-master-schema";
import { SessionRecord } from "@/records/session-record";
import { CourtTimeMasterRepository } from "@/repositories/court-time-master-repository";

type Props = {
  courtTimeMasterRepository: CourtTimeMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetCourtTimeMasterService {
  protected _courtTimeMasterRepository: CourtTimeMasterRepository;

  public constructor(props: Props) {
    this._courtTimeMasterRepository =
      props.courtTimeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtTimeMaster[], Failure>> {
    const isArchived =
      input.isArchived === true ||
      input.isArchived === "1" ||
      input.isArchived === "true";

    const properties =
      await this._courtTimeMasterRepository.getAll({
        isArchived,
      });

    const mappedProperties: ICourtTimeMaster[] = properties.map(
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
        } as ICourtTimeMaster;
      }
    );

    return Result.ok(mappedProperties);
  }
}