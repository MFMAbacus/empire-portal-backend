import { Service } from '@/services/service';
import VenueMaster from '@/schemas/venue-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  projectCode?: string;
  sessionRecord: SessionRecord;
};

export class GetMobileVenueMasterService implements Service<Input, any> {
  // Yahan explicit return type add karein: Promise<Result<any, Failure>>
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      const query: any = {
        isActive: true,
        isArchived: false,
      };

      if (input.projectCode) {
        query.projectCode = input.projectCode;
      }

      const result = await VenueMaster.find(query)
        .select("id venueId venueName type location contact description imageOrLogo projectCode")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}