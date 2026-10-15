import { Service } from '@/services/service';
import CourtBookingMaster from '@/schemas/court-booking-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  sessionRecord: SessionRecord;
  projectCode?: string;
};

export class GetMobileCourtBookingMasterService implements Service<Input, any> {
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
      
      const result = await CourtBookingMaster.find(query)
        .select("id maxBooking advanceBooking projectCode pendingSlot")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}