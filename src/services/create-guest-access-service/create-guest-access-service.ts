import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GuestAccessRepository } from "@/repositories/guest-access-repository";
import { IGuestAccess } from "@/schemas/guest-access-schema";

type Props = {
  guestAccessRepository: GuestAccessRepository;
};

export class CreateGuestAccessService {
  protected _guestAccessRepository: GuestAccessRepository;

  public constructor(props: Props) {
    this._guestAccessRepository = props.guestAccessRepository;
  }

  public async execute(input: any): Promise<Result<IGuestAccess, Failure>> {
    try {
      const payload: any = { ...input };
      payload.id = `GA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      payload.requestNo = `GA-${Math.floor(10000 + Math.random() * 90000)}`;

      // Support both projectCode and projectId from request
      if (!payload.projectCode && payload.projectId) {
        payload.projectCode = payload.projectId;
      }

      payload.status = payload.status || "Pending";
      payload.approvalStatus = payload.approvalStatus || "Pending";
      payload.active = payload.active !== undefined ? payload.active : true;

      await this._guestAccessRepository.Create(payload as IGuestAccess);
      return Result.ok(payload as IGuestAccess);
    } catch (error) {
      return Result.fail(Failure.badRequest("Failed to create guest request"));
    }
  }
}
