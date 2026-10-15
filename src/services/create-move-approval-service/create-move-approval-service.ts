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
  let maxSeq = 0;
  try {
    const count = await MoveApproval.countDocuments();
    maxSeq = count;

    const records = await MoveApproval.find({
      $or: [{ requestId: /^MA-\d+$/ }, { id: /^MA-\d+$/ }],
    })
      .select("requestId id")
      .lean();

    for (const r of records) {
      const val = r.requestId || r.id;
      if (val) {
        const match = val.match(/^MA-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxSeq) maxSeq = num;
        }
      }
    }
  } catch (err) {
    console.error("Error reading sequence numbers:", err);
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
    if (!projectCode || !movementDate || !movementTime) {
      return {
        isRuleValid: true,
        ruleValidationNotes: "Movement rules waived (date/time/project not strictly specified).",
      };
    }

    const rule = await MovementRuleMaster.findOne({
      projectCode,
      isActive: true,
      isArchived: false,
    }).lean();

    const fallbackStart = "08:00";
    const fallbackEnd = "16:00";
    const allowedStart = (rule as any)?.startTime ?? fallbackStart;
    const allowedEnd = (rule as any)?.endTime ?? fallbackEnd;
    const blockedDaysRaw = (rule as any)?.blockedDays;
    const blockedDays: string[] = Array.isArray(blockedDaysRaw)
      ? blockedDaysRaw.map((d: string) => d.toLowerCase().trim())
      : ["friday"];

    // Check day of week
    const dateObj = new Date(movementDate);
    if (!isNaN(dateObj.getTime())) {
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      if (blockedDays.includes(dayName)) {
        return {
          isRuleValid: false,
          ruleValidationNotes: `Movement not allowed on ${dayName} (blocked day).`,
        };
      }
    }

    // Check time window
    const toMins = (t: string) => {
      if (!t || typeof t !== "string" || !t.includes(":")) return -1;
      const [h, m] = t.split(":").map(Number);
      return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    };
    const reqMins = toMins(movementTime);
    const startMins = toMins(allowedStart);
    const endMins = toMins(allowedEnd);

    if (reqMins !== -1 && startMins !== -1 && endMins !== -1) {
      if (reqMins < startMins || reqMins > endMins) {
        return {
          isRuleValid: false,
          ruleValidationNotes: `Movement time ${movementTime} is outside the allowed window (${allowedStart} – ${allowedEnd}).`,
        };
      }
    }

    return {
      isRuleValid: true,
      ruleValidationNotes: `Movement time ${movementTime} on ${movementDate} is within the allowed window (${allowedStart} – ${allowedEnd}).`,
    };
  } catch {
    return { isRuleValid: true, ruleValidationNotes: "Rule check waived." };
  }
}

export class CreateMoveApprovalService {
  protected _moveApprovalRepository: MoveApprovalRepository;

  public constructor(props: Props) {
    this._moveApprovalRepository = props.moveApprovalRepository;
  }

  public async execute(input: any): Promise<Result<IMoveApproval, Failure>> {
    try {
      // 1. Destructure out session metadata and temporary fields so they don't get saved or returned
      const { sessionId, sessionRecord, ...cleanInput } = input;

      const payload: any = { ...cleanInput };

      // Generate sequential request number
      const seqNo = await generateSequentialRequestNo();
      payload.id = seqNo;
      payload.requestId = seqNo;

      // Normalize fields from mobile or portal payloads
      payload.residentId = payload.residentId || payload.customerId || payload.userId || "";
      payload.apartmentId = payload.apartmentId || payload.unitId || payload.unitName || "";
      payload.projectCode = payload.projectCode || payload.projectId || payload.project || "";
      payload.movementTypeId = payload.movementTypeId || payload.movementType || payload.type || "";
      payload.itemTypeId = payload.itemTypeId || payload.itemType || "";
      payload.movementDate = payload.movementDate || payload.visitDate || payload.date || "";
      payload.movementTime = payload.movementTime || payload.visitTime || payload.time || payload.startTime || "";

      // Validate against movement rules
      const { isRuleValid, ruleValidationNotes } = await validateMovementRule(
        payload.projectCode,
        payload.movementDate,
        payload.movementTime
      );
      payload.isRuleValid = isRuleValid;
      payload.ruleValidationNotes = ruleValidationNotes;

      // Status comes from CommonStatusMaster sequence 1 = Pending
      payload.status = payload.status || "Pending";
      payload.active = payload.active !== undefined ? payload.active : true;
      payload.approvalHistory = Array.isArray(payload.approvalHistory) ? payload.approvalHistory : [];

      await this._moveApprovalRepository.Create(payload as IMoveApproval);
      return Result.ok(payload as IMoveApproval);
    } catch (error: any) {
      console.error("Error creating move approval request:", error);
      return Result.fail(Failure.badRequest(error?.message || "Failed to create move approval request"));
    }
  }
}