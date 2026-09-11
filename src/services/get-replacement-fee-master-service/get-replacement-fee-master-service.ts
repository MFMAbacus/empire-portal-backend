import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IReplacementFeeMaster } from "@/schemas/replacement-fee-master-schema";
import { SessionRecord } from "@/records/session-record";
import { ReplacementFeeMasterRepository } from "@/repositories/replacement-fee-master-repository";

type Props = {
  replacementFeeMasterRepository: ReplacementFeeMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetReplacementFeeMasterService {
  protected _replacementFeeMasterRepository: ReplacementFeeMasterRepository;

  public constructor(props: Props) {
    this._replacementFeeMasterRepository = props.replacementFeeMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IReplacementFeeMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._replacementFeeMasterRepository.getAll({ isArchived });

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
