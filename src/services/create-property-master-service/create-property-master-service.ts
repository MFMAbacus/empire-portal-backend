import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { PropertyMasterModel } from "@/models/property-master-model";
import { PropertyMasterRepository } from "@/repositories/property-master-repository";

type Props = {
  propertyMasterRepository: PropertyMasterRepository;
};

type Input = {
  id?: string;
  propertyId?: string;
  projectCode: string;
  projectName: string;
  propertyName: string;
  isActive?: boolean;
};

export class CreatePropertyMasterService {
  protected _propertyMasterRepository: PropertyMasterRepository;

  public constructor(props: Props) {
    this._propertyMasterRepository = props.propertyMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;
    const targetId = input.propertyId || input.id;

    if (targetId) {
      const existing = await this._propertyMasterRepository.get(targetId);
      if (existing) {
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.projectName = input.projectName || existing.projectName;
        existing.propertyName = input.propertyName || existing.propertyName;
        existing.isActive = isActive;
        await this._propertyMasterRepository.Update(existing);
        return Result.ok(targetId);
      }
    }

    const propertyModel = PropertyMasterModel.make({
      id: targetId || Generator.id("PM"),
      projectCode: input.projectCode,
      projectName: input.projectName,
      propertyName: input.propertyName,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = propertyModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = propertyModel.getRecord();
    await this._propertyMasterRepository.Create(record as any);

    return Result.ok(propertyModel.get("id"));
  }
}
