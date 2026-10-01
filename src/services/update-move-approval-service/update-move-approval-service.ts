import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { MoveApprovalRepository } from "@/repositories/move-approval-repository";
import { IMoveApproval } from "@/schemas/move-approval-schema";

type Props = {
  moveApprovalRepository: MoveApprovalRepository;
};

export class UpdateMoveApprovalService {
  protected _moveApprovalRepository: MoveApprovalRepository;

  public constructor(props: Props) {
    this._moveApprovalRepository = props.moveApprovalRepository;
  }

  public async execute(input: any): Promise<Result<IMoveApproval, Failure>> {
    try {
      const record = await this._moveApprovalRepository.Update(input as any);
      return Result.ok(record as IMoveApproval);
    } catch (error) {
      return Result.fail(Failure.badRequest("Failed to update move approval request"));
    }
  }
}
