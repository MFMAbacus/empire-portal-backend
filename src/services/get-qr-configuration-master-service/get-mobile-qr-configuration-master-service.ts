import { Service } from '@/services/service';
import QRConfigurationMaster from '@/schemas/qr-configuration-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  sessionRecord: SessionRecord;
};

export class GetMobileQRConfigurationMasterService implements Service<Input, any> {
  // Yahan explicit return type add karein: Promise<Result<any, Failure>>
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      const query: any = {
        isActive: true,
        isArchived: false,
      };

      const result = await QRConfigurationMaster.find(query)
        .select("id qrConfigId expiryHours isOneTimeScan isGateValidation isPdfRequired ")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}