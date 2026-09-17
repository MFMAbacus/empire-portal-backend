import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtBookingMaster } from "@/schemas/court-booking-master-schema";
import { SessionRecord } from "@/records/session-record";
import { CourtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

type Props = {
  courtBookingMasterRepository: CourtBookingMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetCourtBookingMasterService {
  protected _courtBookingMasterRepository: CourtBookingMasterRepository;

  public constructor(props: Props) {
    this._courtBookingMasterRepository = props.courtBookingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtBookingMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._courtBookingMasterRepository.getAll({ isArchived });

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
