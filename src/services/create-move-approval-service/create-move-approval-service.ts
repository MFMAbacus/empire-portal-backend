import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { MoveApprovalRepository } from "@/repositories/move-approval-repository";
import { IMoveApproval } from "@/schemas/move-approval-schema";

import MoveApproval from "@/schemas/move-approval-schema/move-approval-schema";
import MovementRuleMaster from "@/schemas/movement-rule-master-schema/movement-rule-master-schema";
import PropertyManagementApprovalMaster from "@/schemas/property-management-approval-master-schema/property-management-approval-master-schema";

type Props = {
  moveApprovalRepository: MoveApprovalRepository;
};

async function generateSequentialRequestNo(): Promise<string> {
  const records = await MoveApproval.find({ requestNo: /^MA-\d+$/ })
    .select("requestNo")
    .lean();

  let maxSeq = 0;
  for (const r of records) {
    if (r.requestNo) {
      const match = r.requestNo.match(/^MA-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const formatted = String(nextSeq).padStart(6, "0");
  return `MA-${formatted}`;
}

/**
 * Validate movement date/time against the project's movement rule.
 * Business rules: 08:00 AM – 04:00 PM only, Friday blocked.
 */
async function validateMovementRule(
  projectCode: string,
  movementDate: string,
  movementTime: string
): Promise<{ isRuleValid: boolean; ruleValidationNotes: string }> {
  try {
    const rule = await MovementRuleMaster.findOne({
      projectCode,
      isActive: true,
      isArchived: false,
    }).lean();

    const fallbackStart = "08:00";
    const fallbackEnd = "16:00";
    const allowedStart = (rule as any)?.startTime ?? fallbackStart;
    const allowedEnd = (rule as any)?.endTime ?? fallbackEnd;
    const blockedDaysRaw = (rule as any)?.blockedDays ?? "Friday";
    const blockedDays: string[] = blockedDaysRaw
      ? blockedDaysRaw.split(",").map((d: string) => d.trim().toLowerCase())
      : ["friday"];

    // Check day of week
    const dateObj = new Date(movementDate);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    if (blockedDays.includes(dayName)) {
      return {
        isRuleValid: false,
        ruleValidationNotes: `Movement not allowed on ${dayName} (blocked day).`,
      };
    }

    // Check time window
    const toMins = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const reqMins = toMins(movementTime);
    const startMins = toMins(allowedStart);
    const endMins = toMins(allowedEnd);

    if (reqMins < startMins || reqMins > endMins) {
      return {
        isRuleValid: false,
        ruleValidationNotes: `Movement time ${movementTime} is outside the allowed window (${allowedStart} – ${allowedEnd}).`,
      };
    }

    return {
      isRuleValid: true,
      ruleValidationNotes: `Movement time ${movementTime} on ${movementDate} is within the allowed window (${allowedStart} – ${allowedEnd}).`,
    };
  } catch {
    return { isRuleValid: false, ruleValidationNotes: "Rule validation failed (server error)." };
  }
}

export class CreateMoveApprovalService {
  protected _moveApprovalRepository: MoveApprovalRepository;

  public constructor(props: Props) {
    this._moveApprovalRepository = props.moveApprovalRepository;
  }

  public async execute(input: any): Promise<Result<IMoveApproval, Failure>> {
    try {
      const payload: any = { ...input };

      // Generate sequential request number
      const seqNo = await generateSequentialRequestNo();
      payload.id = seqNo;
      payload.requestNo = seqNo;

      // Normalize projectCode
      if (!payload.projectCode && payload.projectId) {
        payload.projectCode = payload.projectId;
      }

      // Validate against movement rules
      const { isRuleValid, ruleValidationNotes } = await validateMovementRule(
        payload.projectCode,
        payload.movementDate,
        payload.movementTime
      );
      payload.isRuleValid = isRuleValid;
      payload.ruleValidationNotes = ruleValidationNotes;

      // Status comes from CommonStatusMaster sequence 1 = Pending
      payload.status = "Pending";
      payload.active = payload.active !== undefined ? payload.active : true;
      payload.approvalHistory = [];

      await this._moveApprovalRepository.Create(payload as IMoveApproval);
      return Result.ok(payload as IMoveApproval);
    } catch (error) {
      console.error("Error creating move approval request:", error);
      return Result.fail(Failure.badRequest("Failed to create move approval request"));
    }
  }
}
