import { Service } from '@/services/service';
import courtTimeMaster from '@/schemas/court-time-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  sessionRecord: SessionRecord;
  courtId?: string;
};

export class GetMobileCourtTimeMasterService implements Service<Input, any> {
  // Yahan explicit return type add karein: Promise<Result<any, Failure>>
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      const query: any = {
        isActive: true,
        isArchived: false,
      };

      if (input.courtId) {
        query.courtId = input.courtId;
      }
      
      const result = await courtTimeMaster.find(query)
        .select("id courtId startTime endTime slotDuration")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}