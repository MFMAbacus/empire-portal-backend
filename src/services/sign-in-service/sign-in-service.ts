import { Result } from "@/utility/result";
import { ValidationRule } from "@/utility/validation-rule";
import { Failure } from "@/utility/failure";
import { Hash } from "@/utility/hash";
import { Generator } from "@/utility/generator";
import { Attribute } from "@/utility/attribute";
import { ValidationBag } from "@/utility/validation-bag";
import { Validation } from "@/utility/validation";

import { ISessionRecord } from "@/schemas/session-schema";

import { UserRepository } from "@/repositories/user-repository";
import { CustomerRepository } from "@/repositories/customer-repository";
import { SessionRepository } from "@/repositories/session-repository";

type Props = {
  userRepository: UserRepository;
  customerRepository: CustomerRepository;
  sessionRepository: SessionRepository;
};

type Input = {
  login: string;
  password: string;
  role: "staff" | "manager" | "customer";
};

export class SignInService {
  protected _userRepository: UserRepository;
  protected _customerRepository: CustomerRepository;
  protected _sessionRepository: SessionRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
    this._customerRepository = props.customerRepository;
    this._sessionRepository = props.sessionRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<Partial<ISessionRecord>, Failure>> {
    const login = Attribute.make(input.login);
    const password = Attribute.make(input.password);
    const role = Attribute.make(input.role);

    const validationBag = ValidationBag.make();

    validationBag.set(
      "login",
      Validation.make(login.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "password",
      Validation.make(password.get()).mandatory().string().getRule()
    );
    validationBag.set(
      "role",
      Validation.make(role.get()).mandatory().string().getRule()
    );

    if (
      !validationBag.hasError("role") &&
      !["manager", "staff", "customer"].includes(role.get())
    ) {
      validationBag.set("role", ValidationRule.valueIsInvalid());
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const sessionRecord: Partial<ISessionRecord> = {
      id: Generator.shortToken(),
      userId: "",
      role: role.get(),
      firstName: "",
      lastName: "",
      permissions: {},
    };
    const hashedPassword = Hash.make(password.get());

    if (role.get() === "manager" || role.get() === "staff") {
      const userRecord = await this._userRepository.getByEmail(login.get());
      if (typeof userRecord === "undefined" || userRecord.isArchived) {
        return Result.fail(Failure.invalidCredentials());
      }
      if (
        userRecord.password !== hashedPassword ||
        (role.get() === "manager" && userRecord.isMobileUser) ||
        (role.get() === "staff" && !userRecord.isMobileUser)
      ) {
        return Result.fail(Failure.invalidCredentials());
      }
      if (userRecord.isArchived) {
        return Result.fail(Failure.invalidCredentials());
      }
      sessionRecord.userId = userRecord.id;
      sessionRecord.firstName = userRecord.firstName;
      sessionRecord.lastName = userRecord.lastName;
      sessionRecord.departmentId = userRecord.departmentId;
      sessionRecord.permissions = userRecord.permissions;
    }

    if (role.get() === "customer") {
      const customerRecord = await this._customerRepository.getByUsername(
        login.get()
      );
      if (typeof customerRecord === "undefined") {
        return Result.fail(Failure.invalidCredentials());
      }
      if (customerRecord.password !== hashedPassword) {
        return Result.fail(Failure.invalidCredentials());
      }
      if (customerRecord.isBlocked) {
        return Result.fail(Failure.customerBlocked());
      }
      if (!customerRecord.isActive) {
        return Result.fail(Failure.customerNotActivated());
      }
      sessionRecord.userId = customerRecord.id;
      sessionRecord.firstName = customerRecord.firstName;
      sessionRecord.lastName = customerRecord.lastName;
    }

    await this._sessionRepository.Create(sessionRecord);

    return Result.ok(sessionRecord);
  }
}
