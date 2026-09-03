import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IPropertyMaster } from "@/schemas/property-master-schema";
import { PropertyMasterRepository } from "@/repositories/property-master-repository";

type Props = {
  propertyMasterRepository: PropertyMasterRepository;
};

type Input = {
  id: string;
};

export class GetSinglePropertyMasterService {
  protected _propertyMasterRepository: PropertyMasterRepository;

  public constructor(props: Props) {
    this._propertyMasterRepository = props.propertyMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IPropertyMaster, Failure>> {
    const property = await this._propertyMasterRepository.get(input.id);
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
