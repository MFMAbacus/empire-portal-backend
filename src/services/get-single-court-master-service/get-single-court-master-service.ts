import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICourtMaster } from "@/schemas/court-master-schema";
import { CourtMasterRepository } from "@/repositories/court-master-repository";

type Props = {
  courtMasterRepository: CourtMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleCourtMasterService {
  protected _courtMasterRepository: CourtMasterRepository;

  public constructor(props: Props) {
    this._courtMasterRepository = props.courtMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICourtMaster, Failure>> {
    const property = await this._courtMasterRepository.get(input.id);
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
