import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IApartmentMaster } from "@/schemas/apartment-master-schema";
import { ApartmentMasterRepository } from "@/repositories/apartment-master-repository";

type Props = {
  apartmentMasterRepository: ApartmentMasterRepository;
};

type Input = {
  id: string;
};

export class GetSingleApartmentMasterService {
  protected _apartmentMasterRepository: ApartmentMasterRepository;

  public constructor(props: Props) {
    this._apartmentMasterRepository = props.apartmentMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IApartmentMaster, Failure>> {
    const property = await this._apartmentMasterRepository.get(input.id);
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
