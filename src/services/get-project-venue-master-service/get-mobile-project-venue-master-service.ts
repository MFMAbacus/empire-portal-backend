import { Service } from '@/services/service';
import ProjectVenueMaster from '@/schemas/project-venue-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  sessionRecord: SessionRecord;
  venueId?: string;
};

export class GetMobileProjectVenueMasterService implements Service<Input, any> {
  // Yahan explicit return type add karein: Promise<Result<any, Failure>>
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      const query: any = {
        isActive: true,
        isArchived: false,
      };

      if (input.venueId) {
        query.venueId = input.venueId;
      }
      
      const result = await ProjectVenueMaster.find(query)
        .select("id venueId projectCode isAccess")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}