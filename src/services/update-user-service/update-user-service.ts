import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { ValidationRule } from "@/utility/validation-rule";
import { Attribute } from "@/utility/attribute";
import { Hash } from "@/utility/hash";
import { optional } from "@/utility/optional";

import { UserModel } from "@/models/user-model";
import { UserRepository } from "@/repositories/user-repository";
import { ISessionRecord } from "@/schemas/session-schema";
import { UserPermissions } from "@/schemas/session-schema/types";
import { BuyServiceCategoryNames } from "@/records/user-record";

type Props = {
  userRepository: UserRepository;
};

type Input = {
  id: string;
  salespersonId?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  departmentId?: string | null;
  employeeId?: string | null;
  jobTitle?: string | null;
  password?: string;
  isMobileUser?: boolean;
  isCachier?: boolean;
  serviceType?: BuyServiceCategoryNames[] | null;
  project?: string[] | null;
  permissions?: UserPermissions;
  sessionRecord: ISessionRecord;
  profilePicture?: string | null;
};

export class UpdateUserService {
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const id = Attribute.make(input.id);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const userRecord = await this._userRepository.get(id.get());

    if (typeof userRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    if (input.sessionRecord.role !== "manager") {
      if (input.sessionRecord.userId !== userRecord.id) {
        return Result.fail(Failure.notFound());
      }
    }

    const userModel = UserModel.make(userRecord);
    userModel.set(
      "salespersonId",
      optional(input.salespersonId, userRecord.salespersonId)
    );
    userModel.set("firstName", input.firstName);
    userModel.set("lastName", input.lastName);
    userModel.set("email", input.email);
    userModel.set(
      "phoneNumber",
      optional(input.phoneNumber, userRecord.phoneNumber)
    );
    userModel.set(
      "departmentId",
      optional(input.departmentId, userRecord.departmentId)
    );
    userModel.set(
      "employeeId",
      optional(input.employeeId, userRecord.employeeId)
    );
    userModel.set("jobTitle", optional(input.jobTitle, userRecord.jobTitle));
    userModel.set("password", input.password);
    userModel.set("isMobileUser", input.isMobileUser);
    userModel.set("isCachier", input.isCachier);
    userModel.set("serviceType", optional(input.serviceType, []));
    userModel.set("project", optional(input.project, []));
    userModel.set(
      "permissions",
      optional(input.permissions, userRecord.permissions)
    );
    userModel.set(
      "profilePicture",
      optional(input.profilePicture, userRecord.profilePicture)
    );

    const validationBag = userModel.validate();

    if (!validationBag.hasError("email") && userModel.hasChanged("email")) {
      if (await this._userRepository.existsByEmail(userModel.get("email"))) {
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
          userRecord.id
        );
      if (hasAlreadyAssigned) {
        return Result.fail(
          Failure.make({
            code: "service-type-and-project-already-assigned",
          })
        );
      }
    }

    if (userModel.hasChanged("password")) {
      userModel.set("password", Hash.make(userModel.get("password")));
    }

    await this._userRepository.Update(userModel.getRecord());

    return Result.ok(userModel.get("id"));
  }
}
