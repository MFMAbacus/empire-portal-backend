import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GuestAccessRepository } from "@/repositories/guest-access-repository";
import { IGuestAccess } from "@/schemas/guest-access-schema";

type Props = {
  guestAccessRepository: GuestAccessRepository;
};

import GuestAccess from "@/schemas/guest-access-schema/guest-access-schema";

async function generateSequentialRequestNo(): Promise<string> {
  const count = await GuestAccess.countDocuments();
  let maxSeq = count;

  const records = await GuestAccess.find({ requestNo: /^GA-\d+$/ })
    .select("requestNo")
    .lean();

  for (const r of records) {
    if (r.requestNo) {
      const match = r.requestNo.match(/^GA-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const formatted = String(nextSeq).padStart(6, "0");
  return `GA-${formatted}`;
}

export class CreateGuestAccessService {
  protected _guestAccessRepository: GuestAccessRepository;

  public constructor(props: Props) {
    this._guestAccessRepository = props.guestAccessRepository;
  }

  public async execute(input: any): Promise<Result<IGuestAccess, Failure>> {
    try {
      const payload: any = { ...input };
      
      const seqNo = await generateSequentialRequestNo();
      payload.id = seqNo;
      payload.requestNo = seqNo;

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
      console.error("Error creating guest request:", error);
      return Result.fail(Failure.badRequest("Failed to create guest request"));
    }
  }
}
