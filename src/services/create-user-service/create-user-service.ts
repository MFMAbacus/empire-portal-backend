import { Result } from "@/utility/result";
import { ValidationRule } from "@/utility/validation-rule";
import { Failure } from "@/utility/failure";
import { Hash } from "@/utility/hash";
import { Generator } from "@/utility/generator";
import { optional } from "@/utility/optional";

import { UserModel } from "@/models/user-model";
import { UserPermissions } from "@/schemas/session-schema/types";
import { UserRepository } from "@/repositories/user-repository";
import { User } from "@/schemas/user-schema";
import { BuyServiceCategoryNames } from "@/records/user-record";

type Props = {
  userRepository: UserRepository;
};

type Input = {
  salespersonId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  departmentId?: string | null;
  employeeId?: string | null;
  jobTitle?: string | null;
  password: string;
  isMobileUser: boolean;
  isCachier?: boolean;
  serviceType?: BuyServiceCategoryNames[] | null;
  project?: string[] | null;
  profilePicture?: string | null;
  permissions?: UserPermissions;
};

export class CreateUserService {
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const data = new User({
      id: Generator.id("U"),
      salespersonId: optional(input.salespersonId, null),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: optional(input.phoneNumber, null),
      departmentId: optional(input.departmentId, null),
      employeeId: optional(input.employeeId, null),
      jobTitle: optional(input.jobTitle, null),
      password: input.password,
      isMobileUser: input.isMobileUser,
      isCachier: optional(input.isCachier, false),
      serviceType: optional(input.serviceType, []),
      project: optional(input.project, null),
      permissions: optional(input.permissions, {}),
      profilePicture: optional(input.profilePicture, null),
      isArchived: false,
    });
    const userModel = UserModel.make(data);

    const validationBag = userModel.validate();

    if (!validationBag.hasError("email")) {
      const email = userModel.get<string>("email");
      if (await this._userRepository.existsByEmail(email)) {
        validationBag.set("email", ValidationRule.valueIsAlreadyUsed());
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    if (typeof input.isCachier !== "undefined" && input.isCachier) {
      if (typeof input.isMobileUser !== "undefined" && !input.isMobileUser) {
        return Result.fail(
          Failure.make({
            code: "manager-cannot-be-cachier",
          })
        );
      }

      const hasAlreadyAssigned =
        await this._userRepository.existsByServiceTypeAndProject(
          userModel.get("serviceType"),
          userModel.get("project"),
          undefined
        );
      if (hasAlreadyAssigned) {
        return Result.fail(
          Failure.make({
            code: "service-type-and-project-already-assigned",
          })
        );
      }
    }

    userModel.set("password", Hash.make(input.password));

    await this._userRepository.Create(userModel.getRecord());

    return Result.ok(userModel.get("id"));
  }
}
