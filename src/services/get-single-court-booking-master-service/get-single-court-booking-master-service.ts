import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtBookingMaster } from "@/schemas/court-booking-master-schema";
import { CourtBookingMasterRepository } from "@/repositories/court-booking-master-repository";

type Props = {
  courtBookingMasterRepository: CourtBookingMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleCourtBookingMasterService {
  protected _courtBookingMasterRepository: CourtBookingMasterRepository;

  public constructor(props: Props) {
    this._courtBookingMasterRepository = props.courtBookingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtBookingMaster, Failure>> {
    const property = await this._courtBookingMasterRepository.get(input.id);
    if (!property) {
      return Result.fail(Failure.notFound());
    }

    const doc = typeof (property as any).toObject === "function" ? (property as any).toObject() : { ...property };
    const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;

    return Result.ok({
      ...doc,
      isActive,
    } as any);
  }
}
