import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { IUserRole } from "@/schemas/role-schema";
import { SessionRecord } from "@/records/session-record";
import { UserRoleRepository } from "@/repositories/role-repository";

type Props = {
  userRoleRepository: UserRoleRepository;
};

type Input = {
  sessionRecord: SessionRecord;
};

export class GetUserRoleService {
  protected _userRoleRepository: UserRoleRepository;

  public constructor(props: Props) {
    this._userRoleRepository = props.userRoleRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IUserRole[], Failure>> {
    const roles = await this._userRoleRepository.getAll();

    const mappedRoles = roles.map((item) => {
      const doc = typeof (item as any).toObject === "function" ? (item as any).toObject() : { ...item };
      return {
        ...doc,
      };
    });

    return Result.ok(mappedRoles as any);
  }
}