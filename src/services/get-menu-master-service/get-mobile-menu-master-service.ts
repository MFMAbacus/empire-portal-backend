import { Service } from '@/services/service';
import MenuMaster from '@/schemas/menu-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  venueId?: string;
  sessionRecord: SessionRecord;
};

export class GetMobileMenuMasterService implements Service<Input, any> {
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

      const result = await MenuMaster.find(query)
        .select("id menuId menuName price menuItem venueId")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}