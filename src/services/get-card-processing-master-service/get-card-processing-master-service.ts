import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { CardProcessingMasterRepository } from "@/repositories/card-processing-master-repository";
import { ICardProcessingMaster } from "@/schemas/card-processing-master-schema";
import AccessCardStaffMaster from "@/schemas/access-card-staff-master-schema/access-card-staff-master-schema";

type Props = {
  cardProcessingMasterRepository: CardProcessingMasterRepository;
};

type GetCardProcessingOptions = {
  isArchived?: boolean;
  residentId?: string;
  projectCode?: string;
  userId?: string;
};

export class GetCardProcessingMasterService {
  protected _cardProcessingMasterRepository: CardProcessingMasterRepository;

  public constructor(props: Props) {
    this._cardProcessingMasterRepository = props.cardProcessingMasterRepository;
  }

  public async execute(
    options: GetCardProcessingOptions = {}
  ): Promise<Result<ICardProcessingMaster[], Failure>> {
    try {
      let projectCodes: string[] | undefined = undefined;

      // Filter by userId if staff member is logged in
      if (options.userId) {
        const staffMappings = await AccessCardStaffMaster.find({
          $or: [{ staffRole: options.userId }, { id: options.userId }],
          isActive: true,
          isArchived: false,
        }).lean();

        if (staffMappings && staffMappings.length > 0) {
          projectCodes = staffMappings.map((m: any) => m.projectCode);
        }
      }

      const records = await this._cardProcessingMasterRepository.getAll({
        isArchived: options.isArchived,
        residentId: options.residentId,
        projectCode: options.projectCode,
        projectCodes,
      });

      return Result.ok(records);
    } catch (error) {
      console.error("Error fetching card processing requests:", error);
      return Result.fail(Failure.badRequest("Failed to fetch card processing requests"));
    }
  }
}
