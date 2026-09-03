import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IPropertyMaster } from "@/schemas/property-master-schema";
import { SessionRecord } from "@/records/session-record";
import { PropertyMasterRepository } from "@/repositories/property-master-repository";

type Props = {
  propertyMasterRepository: PropertyMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetPropertyMasterService {
  protected _propertyMasterRepository: PropertyMasterRepository;

  public constructor(props: Props) {
    this._propertyMasterRepository = props.propertyMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IPropertyMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._propertyMasterRepository.getAll({ isArchived });

    const mappedProperties = properties.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      const isActive = typeof doc.isActive !== "undefined" ? Boolean(doc.isActive) : true;
      return {
        ...doc,
        isActive,
      };
    });

    return Result.ok(mappedProperties as any);
  }
}
