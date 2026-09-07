import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { UserMasterModel } from "@/models/user-master-model";
import { UserMasterRepository } from "@/repositories/user-master-repository";

type Props = {
  userMasterRepository: UserMasterRepository;
};

type Input = {
  id?: string;             // Database record ID
  userId: string;      // Unique User Identifier
  name?: string;
  role?: string;
  assignedModule?: string;
  projectCode?: string;
  isActive?: boolean;
};

export class UpdateUserMasterService {
  protected _userMasterRepository: UserMasterRepository;

  public constructor(props: Props) {
    this._userMasterRepository = props.userMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    // Primary Key (id) prioritized first, fallback to userId
    const targetId = input.id || input.userId;

    if (!targetId) {
      return Result.fail(Failure.badRequest());
    }

    // Existing record fetch kar rahe hain
    const record = await this._userMasterRepository.get(targetId);
    if (!record) {
      return Result.fail(Failure.notFound());
    }

    const isActive =
      typeof input.isActive !== "undefined"
        ? Boolean(input.isActive)
        : record.isActive;

    // Model me user fields map aur validate kar rahe hain (naya input ya purana fallback)
    const userModel = UserMasterModel.make({
      id: targetId,
      userId: input.userId || record.userId,
      name: input.name || record.name,
      role: input.role || record.role,
      assignedModule: input.assignedModule || record.assignedModule,
      projectCode: input.projectCode || record.projectCode,
      isActive: isActive,
      isArchived: record.isArchived ?? false,
    });

    const validationBag = userModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updatedRecord = userModel.getRecord();
    await this._userMasterRepository.Update(updatedRecord as any);

    return Result.ok(targetId);
  }
}