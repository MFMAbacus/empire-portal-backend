import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtOperatingMaster } from "@/schemas/court-operating-master-schema";
import { CourtOperatingMasterRepository } from "@/repositories/court-operating-master-repository";

type Props = {
  courtOperatingMasterRepository: CourtOperatingMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleCourtOperatingMasterService {
  protected _courtOperatingMasterRepository: CourtOperatingMasterRepository;

  public constructor(props: Props) {
    this._courtOperatingMasterRepository = props.courtOperatingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtOperatingMaster, Failure>> {
    const property = await this._courtOperatingMasterRepository.get(input.id);
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
