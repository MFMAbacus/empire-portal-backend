import { Service } from '@/services/service';
import VenueOperatingMaster from '@/schemas/venue-operating-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  venueId?: string;
  sessionRecord: SessionRecord;
};

export class GetMobileVenueOperatingMasterService implements Service<Input, any> {
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

      const result = await VenueOperatingMaster.find(query)
        .select("id venueId day openTime closeTime isClosed")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}