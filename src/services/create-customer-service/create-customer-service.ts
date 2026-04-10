import { Result } from "@/utility/result";
import { ValidationRule } from "@/utility/validation-rule";
import { Failure } from "@/utility/failure";
import { Hash } from "@/utility/hash";
import { Generator } from "@/utility/generator";
import { optional } from "@/utility/optional";

import { CustomerModel } from "@/models/customer-model";
import { CustomerRepository } from "@/repositories/customer-repository";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  id: string;
  projectId: string | null;
  subProject: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  comments: string | null;
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactNumber: string | null;
};

export class CreateCustomerService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const customerModel = CustomerModel.make({
      id: optional(input.id, Generator.id("C")),
      projectId: optional(input.projectId, null),
      subProject: optional(input.subProject, null),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      dateOfBirth: input.dateOfBirth,
      address: input.address,
      comments: optional(input.comments, null),
      emergencyContactName: optional(input.emergencyContactName, null),
      emergencyContactRelationship: optional(
        input.emergencyContactRelationship,
        null
      ),
      emergencyContactNumber: optional(input.emergencyContactNumber, null),
      vehicles: [],
      username: Generator.shortToken(),
      password: Hash.make(Generator.shortToken()),
      isInvited: false,
      isActive: false,
      isBlocked: false,
      profilePicture: null,
    });

    const validationBag = customerModel.validate();

    if (!validationBag.hasError("phoneNumber")) {
      const phoneNumber = customerModel.get<string>("phoneNumber");
      if (await this._customerRepository.existsByPhoneNumber(phoneNumber)) {
        validationBag.set("phoneNumber", ValidationRule.valueIsAlreadyUsed());
      }
    }

    if (!validationBag.hasError("email")) {
      const email = customerModel.get<string>("email");
      if (await this._customerRepository.existsByEmail(email)) {
        validationBag.set("email", ValidationRule.valueIsAlreadyUsed());
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._customerRepository.Create(customerModel.getRecord());

    return Result.ok(customerModel.get("id"));
  }
}
