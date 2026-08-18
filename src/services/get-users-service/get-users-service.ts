import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { IUserRecord } from "@/schemas/user-schema";
import { UserRepository } from "@/repositories/user-repository";

type Props = {
  userRepository: UserRepository;
};

type Input = {
  isArchived?: boolean;
};

export class GetUsersService {
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<IUserRecord[], Failure>> {
    let usersRecords = await this._userRepository.getAll();

    usersRecords = usersRecords.filter((current) => {
      return current.isArchived === Boolean(input.isArchived);
    });

    return Result.ok(usersRecords);
  }
}
