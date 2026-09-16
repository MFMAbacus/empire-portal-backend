import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IReservationRuleMaster } from "@/schemas/reservation-rule-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ReservationRuleMasterRepository } from "@/repositories/reservation-rule-master-repository";

type Props = {
  reservationRuleMasterRepository: ReservationRuleMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetReservationRuleMasterService {
  protected _reservationRuleMasterRepository: ReservationRuleMasterRepository;

  public constructor(props: Props) {
    this._reservationRuleMasterRepository = props.reservationRuleMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IReservationRuleMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._reservationRuleMasterRepository.getAll({ isArchived });

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
