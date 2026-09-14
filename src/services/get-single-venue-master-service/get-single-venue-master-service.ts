import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IVenueMaster } from "@/schemas/venue-master-schema";
import { VenueMasterRepository } from "@/repositories/venue-master-repository";

type Props = {
  venueMasterRepository: VenueMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleVenueMasterService {
  protected _venueMasterRepository: VenueMasterRepository;

  public constructor(props: Props) {
    this._venueMasterRepository = props.venueMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IVenueMaster, Failure>> {
    const property = await this._venueMasterRepository.get(input.id);
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
