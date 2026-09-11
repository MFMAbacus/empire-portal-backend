import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IAccessCardMaster } from "@/schemas/access-card-master-schema";
import { SessionRecord } from "@/records/session-record";
import { AccessCardMasterRepository } from "@/repositories/access-card-master-repository";

type Props = {
  accessCardMasterRepository: AccessCardMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetAccessCardMasterService {
  protected _accessCardMasterRepository: AccessCardMasterRepository;

  public constructor(props: Props) {
    this._accessCardMasterRepository = props.accessCardMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IAccessCardMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._accessCardMasterRepository.getAll({ isArchived });

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
