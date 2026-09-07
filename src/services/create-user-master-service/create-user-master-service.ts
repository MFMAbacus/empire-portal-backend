import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { UserMasterModel } from "@/models/user-master-model";
import { UserMasterRepository } from "@/repositories/user-master-repository";

type Props = {
  userMasterRepository: UserMasterRepository;
};

type Input = {
  id?: string;           // Database Primary Key (Edit mode me)
  userId?: string;   // Unique User Code
  name: string;
  role: string;
  assignedModule?: string;
  projectCode: string;
  isActive?: boolean;
};

export class CreateUserMasterService {
  protected _userMasterRepository: UserMasterRepository;

  public constructor(props: Props) {
    this._userMasterRepository = props.userMasterRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const isActive = typeof input.isActive !== "undefined" ? Boolean(input.isActive) : true;

    // UPDATE LOGIC (Jab Primary Key 'input.id' pass ki gayi ho)
    if (input.id) {
      const existing = await this._userMasterRepository.get(input.id);
      if (existing) {
        existing.userId = input.userId || existing.userId;
        existing.name = input.name || existing.name;
        existing.role = input.role || existing.role;
        existing.assignedModule = input.assignedModule || existing.assignedModule;
        existing.projectCode = input.projectCode || existing.projectCode;
        existing.isActive = isActive;

        await this._userMasterRepository.Update(existing as any);
        return Result.ok(input.id);
      }
    }

    // CREATE LOGIC (Naya record banne par Primary Key 'UM' prefix se generate hogi)
    const primaryKeyId = input.id || Generator.id("UM");
    const userId = input.userId || Generator.id("RES");

    const userModel = UserMasterModel.make({
      id: primaryKeyId,
      userId: userId,
      name: input.name,
      role: input.role,
      assignedModule: input.assignedModule || "",
      projectCode: input.projectCode,
      isActive: isActive,
      isArchived: false,
    });

    const validationBag = userModel.validate();
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const record = userModel.getRecord();
    await this._userMasterRepository.Create(record as any);

    return Result.ok(userModel.get("id"));
  }
}