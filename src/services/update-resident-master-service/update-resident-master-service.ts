import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ResidentMasterModel } from "@/models/resident-master-model";
import { ResidentMasterRepository } from "@/repositories/resident-master-repository";

type Props = {
  residentMasterRepository: ResidentMasterRepository;
};

type Input = {
  id?: string;             // Database record ID
  residentId: string;      // Unique Resident Identifier
  name?: string;
  email?: string;
  mobileNo?: number;       // Primitive number type
  loginUserId?: string;
  residentType?: string;
  apartmentId?: string;
  projectCode?: string;
  isActive?: boolean;
};

export class UpdateResidentMasterService {
  protected _residentMasterRepository: ResidentMasterRepository;

  public constructor(props: Props) {
    this._residentMasterRepository = props.residentMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to residentId
    const targetId = input.id || input.residentId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._residentMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Model me resident fields map aur validate kar rahe hain (naya input ya purana fallback)
    const residentModel = ResidentMasterModel.make({
      id: targetId,
      residentId: input.residentId || record.residentId,
      name: input.name || record.name,
      email: input.email || record.email,
      mobileNo: input.mobileNo ?? record.mobileNo,
      loginUserId: input.loginUserId || record.loginUserId,
      residentType: input.residentType || record.residentType,
      apartmentId: input.apartmentId || record.apartmentId,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = residentModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = residentModel.getRecord();
    await this._residentMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}