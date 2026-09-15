import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IVenueOperatingMaster } from "@/schemas/venue-operating-master-schema";
import { SessionRecord } from "@/records/session-record";
import { VenueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

type Props = {
  venueOperatingMasterRepository: VenueOperatingMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetVenueOperatingMasterService {
  protected _venueOperatingMasterRepository: VenueOperatingMasterRepository;

  public constructor(props: Props) {
    this._venueOperatingMasterRepository =
      props.venueOperatingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IVenueOperatingMaster[], Failure>> {
    const isArchived =
      input.isArchived === true ||
      input.isArchived === "1" ||
      input.isArchived === "true";

    const properties =
      await this._venueOperatingMasterRepository.getAll({
        isArchived,
      });

    const mappedProperties: IVenueOperatingMaster[] = properties.map(
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
        } as IVenueOperatingMaster;
      }
    );

    return Result.ok(mappedProperties);
  }
}