import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { PropertyMasterRepository } from "@/repositories/property-master-repository";

type Props = {
  propertyMasterRepository: PropertyMasterRepository;
};

type Input = {
  id?: string;
  propertyId?: string;
  projectCode?: string;
  projectName?: string;
  propertyName?: string;
  isActive?: boolean;
};

export class UpdatePropertyMasterService {
  protected _propertyMasterRepository: PropertyMasterRepository;

  public constructor(props: Props) {
    this._propertyMasterRepository = props.propertyMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const targetId = input.id || input.propertyId || "";
    const record = await this._propertyMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    if (input.projectCode) record.projectCode = input.projectCode;
    if (input.projectName) record.projectName = input.projectName;
    if (input.propertyName) record.propertyName = input.propertyName;
    if (typeof input.isActive !== "undefined") {
      record.isActive = Boolean(input.isActive);
    }

    await this._propertyMasterRepository.Update(record);
    return Result.ok(targetId);
  }
}
