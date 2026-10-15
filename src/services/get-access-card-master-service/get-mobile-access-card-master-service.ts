import { Service } from '@/services/service';
import AccessCardMaster from '@/schemas/access-card-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  residentId?: string;
  sessionRecord: SessionRecord;
};

export class GetMobileAccessCardMasterService implements Service<Input, any> {
  // Yahan explicit return type add karein: Promise<Result<any, Failure>>
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      const query: any = {
        isActive: true,
        isArchived: false,
      };

      if (input.residentId) {
        query.residentId = input.residentId;
      }

      const result = await AccessCardMaster.find(query)
        .select("id cardId serialNo maskedSerial issueDate cardStatus projectCode apartmentId residentId")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}