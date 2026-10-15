import { Service } from '@/services/service';
import CardReplacementMaster from '@/schemas/card-replacement-reason-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  sessionRecord: SessionRecord;
};

export class GetMobileCardReplacementReasonMasterService implements Service<Input, any> {
  // Yahan explicit return type add karein: Promise<Result<any, Failure>>
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      const query: any = {
        isActive: true,
        isArchived: false,
      };

      const result = await CardReplacementMaster.find(query)
        .select("id reasonId reasonName chargesApplicable ")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}