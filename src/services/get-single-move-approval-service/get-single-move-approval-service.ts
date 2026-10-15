import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { MoveApprovalRepository } from "@/repositories/move-approval-repository";
import { IMoveApproval } from "@/schemas/move-approval-schema";

type Props = {
  moveApprovalRepository: MoveApprovalRepository;
};

export class GetSingleMoveApprovalService {
  protected _moveApprovalRepository: MoveApprovalRepository;

  public constructor(props: Props) {
    this._moveApprovalRepository = props.moveApprovalRepository;
  }

  public async execute(input: any): Promise<Result<IMoveApproval, Failure>> {
    try {
      const id = typeof input === "string" ? input : (input?.requestId || input?.id);
      if (!id) return Result.fail(Failure.badRequest("requestId is required"));
      const record = await this._moveApprovalRepository.get(id);
      if (!record) {
        return Result.fail(Failure.notFound());
      }
      return Result.ok(record);
    } catch (error) {
      return Result.fail(Failure.badRequest("Failed to get move approval request"));
    }
  }
}
