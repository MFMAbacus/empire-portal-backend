import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { ValidationRule } from "@/utility/validation-rule";
import { Attribute } from "@/utility/attribute";
import { Hash } from "@/utility/hash";
import { optional } from "@/utility/optional";

import { CustomerModel } from "@/models/customer-model";
import { CustomerRepository } from "@/repositories/customer-repository";
import { SessionRecord } from "@/records/session-record";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  comments?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactNumber?: string | null;
  password?: string;
  profilePicture?: string | null;
  sessionRecord: SessionRecord;
};

export class UpdateCustomerService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
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

    const customerRecord = await this._customerRepository.get(id.get());
    if (typeof customerRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    if (input.sessionRecord.role !== "manager") {
      if (input.sessionRecord.userId !== customerRecord.id) {
        return Result.fail(Failure.notFound());
      }
    }

    const customerModel = CustomerModel.make(customerRecord);
    customerModel.set("firstName", input.firstName);
    customerModel.set("lastName", input.lastName);
    customerModel.set("email", optional(input.email, customerRecord.email));
    customerModel.set("phoneNumber", input.phoneNumber);
    customerModel.set("dateOfBirth", input.dateOfBirth);
    customerModel.set("address", input.address);
    customerModel.set(
      "comments",
      optional(input.comments, customerRecord.comments)
    );
    customerModel.set(
      "emergencyContactName",
      optional(input.emergencyContactName, customerRecord.emergencyContactName)
    );
    customerModel.set(
      "emergencyContactRelationship",
      optional(
        input.emergencyContactRelationship,
        customerRecord.emergencyContactRelationship
      )
    );
    customerModel.set(
      "emergencyContactNumber",
      optional(
        input.emergencyContactNumber,
        customerRecord.emergencyContactNumber
      )
    );
    customerModel.set("password", input.password);
    customerModel.set(
      "profilePicture",
      optional(input.profilePicture, customerRecord.profilePicture)
    );

    const validationBag = customerModel.validate();

    if (
      !validationBag.hasError("phoneNumber") &&
      customerModel.hasChanged("phoneNumber")
    ) {
      const phoneNumber = customerModel.get<string>("phoneNumber");
      if (await this._customerRepository.existsByPhoneNumber(phoneNumber)) {
        validationBag.set("phoneNumber", ValidationRule.valueIsAlreadyUsed());
      }
    }

    if (customerModel.hasChanged("phoneNumber")) {
      customerModel.set("isInvited", false);
      customerModel.set("isActive", false);
      customerModel.set("username", "");
    }
    // if (!validationBag.hasError("email") && customerModel.hasChanged("email")) {
    //   const email = customerModel.get<string>("email");
    //   if (await this._customerRepository.existsByEmail(email)) {
    //     validationBag.set("email", ValidationRule.valueIsAlreadyUsed());
    //   }
    // }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    if (customerModel.hasChanged("password")) {
      customerModel.set("password", Hash.make(customerModel.get("password")));
    }

    await this._customerRepository.Update(customerModel.getRecord());

    return Result.ok(customerModel.get("id"));
  }
}
