import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtBlockingMaster } from "@/schemas/court-blocking-master-schema";
import { CourtBlockingMasterRepository } from "@/repositories/court-blocking-master-repository";

type Props = {
  courtBlockingMasterRepository: CourtBlockingMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleCourtBlockingMasterService {
  protected _courtBlockingMasterRepository: CourtBlockingMasterRepository;

  public constructor(props: Props) {
    this._courtBlockingMasterRepository = props.courtBlockingMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtBlockingMaster, Failure>> {
    const property = await this._courtBlockingMasterRepository.get(input.id);
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
