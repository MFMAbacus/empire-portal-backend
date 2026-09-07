import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IUserMaster } from "@/schemas/user-master-schema";
import { SessionRecord } from "@/records/session-record";
import { UserMasterRepository } from "@/repositories/user-master-repository";

type Props = {
  userMasterRepository: UserMasterRepository;
};

type Input = {
  isArchived?: boolean | string;
  sessionRecord: SessionRecord;
};

export class GetUserMasterService {
  protected _userMasterRepository: UserMasterRepository;

  public constructor(props: Props) {
    this._userMasterRepository = props.userMasterRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IUserMaster[], Failure>> {
    const isArchived = input.isArchived === true || input.isArchived === "1" || input.isArchived === "true";
    const properties = await this._userMasterRepository.getAll({ isArchived });

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
