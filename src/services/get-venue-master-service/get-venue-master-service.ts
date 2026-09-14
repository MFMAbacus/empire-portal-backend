import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IVenueMaster } from "@/schemas/venue-master-schema";
import { SessionRecord } from "@/records/session-record";
import { VenueMasterRepository } from "@/repositories/venue-master-repository";

type Props = {
  venueMasterRepository: VenueMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetVenueMasterService {
  protected _venueMasterRepository: VenueMasterRepository;

  public constructor(props: Props) {
    this._venueMasterRepository = props.venueMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IVenueMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._venueMasterRepository.getAll({ isArchived });

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
