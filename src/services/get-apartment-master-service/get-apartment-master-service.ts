import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IApartmentMaster } from "@/schemas/apartment-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ApartmentMasterRepository } from "@/repositories/apartment-master-repository";

type Props = {
  apartmentMasterRepository: ApartmentMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetApartmentMasterService {
  protected _apartmentMasterRepository: ApartmentMasterRepository;

  public constructor(props: Props) {
    this._apartmentMasterRepository = props.apartmentMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IApartmentMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._apartmentMasterRepository.getAll({ isArchived });

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
