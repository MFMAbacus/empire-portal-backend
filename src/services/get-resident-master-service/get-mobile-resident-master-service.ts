import { Service } from '@/services/service';
import ResidentMaster from '@/schemas/resident-master-schema';
import { Result } from '@/utility/result';
import { Failure } from '@/utility/failure'; // Failure import karein
import { SessionRecord } from '@/records/session-record';

type Input = {
  projectCode?: string;
  apartmentId?: string;
  sessionRecord: SessionRecord;
};

export class GetMobileResidentMasterService implements Service<Input, any> {
  // Yahan explicit return type add karein: Promise<Result<any, Failure>>
  public async execute(input: Input): Promise<Result<any, Failure>> {
    try {
      // Check karein ke projectCode aur apartmentId dono mojood hain ya nahi
      if (!input.projectCode || !input.apartmentId) {
        return Result.fail(Failure.badRequest("Both projectCode and apartmentId are required."));
      }

      const query: any = {
        isActive: true,
        isArchived: false,
        projectCode: input.projectCode,
        apartmentId: input.apartmentId,
      };

      const result = await ResidentMaster.find(query)
        .select("id residentId name email mobileNo loginUserId residentType apartmentId projectCode")
        .lean();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as any);
    }
  }
}