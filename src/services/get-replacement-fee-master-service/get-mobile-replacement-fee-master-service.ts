import { Service } from '@/services/service';
import ReplacementFeeMaster from '@/schemas/replacement-fee-master-schema';
import CardReplacementReasonMaster from '@/schemas/card-replacement-reason-master-schema'; // 👈 Reason schema import kar lo
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure';
import { SessionRecord } from '@/records/session-record';

type Input = {
  projectCode?: string;
  reasonId?: string;
  sessionRecord: SessionRecord;
};

export class GetMobileReplacementFeeMasterService implements Service<Input, any> {
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      if (input.reasonId) {
        const reason = await CardReplacementReasonMaster.findOne({
          $or: [
            { reasonId: input.reasonId }, 
            { id: input.reasonId }
          ],
          isArchived: false,
        }).lean();
        if (reason && reason.chargesApplicable === false) {
          return Result.ok({
            chargesApplicable: false,
            feeAmount: 0,
            currency: "",
            tax: 0,
            message: "No charges applicable for this reason.",
          });
        }
      }
      const query: any = {
        isActive: true,
        isArchived: false,
      };

      if (input.projectCode) {
        query.projectCode = input.projectCode;
      }

      const feeRecord = await ReplacementFeeMaster.findOne(query) // find() ki jagah findOne bhi kar sakte hain agar project ke hisab se aik hi fee ho
        .select("id feeId feeAmount currency tax projectCode")
        .lean();

      return Result.ok({ chargesApplicable: true, feeData: feeRecord || null,});
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}