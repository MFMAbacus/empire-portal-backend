import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IGateMaster } from "@/schemas/gate-master-schema";
import { SessionRecord } from "@/records/session-record";
import { GateMasterRepository } from "@/repositories/gate-master-repository";

type Props = {
  gateMasterRepository: GateMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetGateMasterService {
  protected _gateMasterRepository: GateMasterRepository;

  public constructor(props: Props) {
    this._gateMasterRepository = props.gateMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IGateMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._gateMasterRepository.getAll({ isArchived });

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
