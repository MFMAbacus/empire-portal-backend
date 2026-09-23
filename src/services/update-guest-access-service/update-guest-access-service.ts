import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GuestAccessRepository } from "@/repositories/guest-access-repository";
import { IGuestAccess } from "@/schemas/guest-access-schema";

type Props = {
  guestAccessRepository: GuestAccessRepository;
};

export class UpdateGuestAccessService {
  protected _guestAccessRepository: GuestAccessRepository;

  public constructor(props: Props) {
    this._guestAccessRepository = props.guestAccessRepository;
  }

  public async execute(input: any): Promise<Result<IGuestAccess, Failure>> {
    try {
      const record = await this._guestAccessRepository.Update(input as any);
      return Result.ok(record as IGuestAccess);
    } catch (error) {
      return Result.fail(Failure.badRequest("Failed to update"));
    }
  }
}
