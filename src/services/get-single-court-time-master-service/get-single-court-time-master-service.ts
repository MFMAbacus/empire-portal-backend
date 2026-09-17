import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtTimeMaster } from "@/schemas/court-time-master-schema";
import { CourtTimeMasterRepository } from "@/repositories/court-time-master-repository";

type Props = {
  courtTimeMasterRepository: CourtTimeMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleCourtTimeMasterService {
  protected _courtTimeMasterRepository: CourtTimeMasterRepository;

  public constructor(props: Props) {
    this._courtTimeMasterRepository = props.courtTimeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtTimeMaster, Failure>> {
    const property = await this._courtTimeMasterRepository.get(input.id);
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
