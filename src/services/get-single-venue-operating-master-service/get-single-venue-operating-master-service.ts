import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IVenueOperatingMaster } from "@/schemas/venue-operating-master-schema";
import { VenueOperatingMasterRepository } from "@/repositories/venue-operating-master-repository";

type Props = {
  venueOperatingMasterRepository: VenueOperatingMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleVenueOperatingMasterService {
  protected _venueOperatingMasterRepository: VenueOperatingMasterRepository;

  public constructor(props: Props) {
    this._venueOperatingMasterRepository = props.venueOperatingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IVenueOperatingMaster, Failure>> {
    const property = await this._venueOperatingMasterRepository.get(input.id);
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
