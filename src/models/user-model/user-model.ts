import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";

import { IUserRecord } from "@/schemas/user-schema";
import { Validation } from "@/utility/validation";

export class UserModel extends Model {
  public static make(record: IUserRecord): UserModel {
    // console.log(record);
    const filteredRecord: Partial<IUserRecord> = {
      _id: record._id,
      id: record.id,
      salespersonId: record.salespersonId,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      departmentId: record.departmentId,
      employeeId: record.employeeId,
      jobTitle: record.jobTitle,
      password: record.password,
      isMobileUser: record.isMobileUser,
      isCachier: record.isCachier,
      serviceType: record.serviceType,
      project: record.project,
      profilePicture: record.profilePicture,
      isArchived: record.isArchived,
      permissions: record.permissions,
    };

    const model = new UserModel(Model._makeAttributes(filteredRecord));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    // eslint-disable-next-line max-len
    validationBag.set(
      "salespersonId",
      Validation.make(this.get("salespersonId")).optional().string().getRule()
    );
    validationBag.set(
      "firstName",
      Validation.make(this.get("firstName")).mandatory().string().getRule()
    );
    validationBag.set(
      "lastName",
      Validation.make(this.get("lastName")).mandatory().string().getRule()
    );
    validationBag.set(
      "email",
      Validation.make(this.get("email")).mandatory().string().getRule()
    );
    validationBag.set(
      "phoneNumber",
      Validation.make(this.get("phoneNumber")).optional().string().getRule()
    );
    validationBag.set(
      "departmentId",
      Validation.make(this.get("departmentId")).optional().string().getRule()
    );
    validationBag.set(
      "employeeId",
      Validation.make(this.get("employeeId")).optional().string().getRule()
    );
    validationBag.set(
      "jobTitle",
      Validation.make(this.get("jobTitle")).optional().string().getRule()
    );
    validationBag.set(
      "password",
      Validation.make(this.get("password")).mandatory().string().getRule()
    );
    validationBag.set(
      "isMobileUser",
      Validation.make(this.get("isMobileUser")).mandatory().boolean().getRule()
    );
    validationBag.set(
      "serviceType",
      Validation.make(this.get("serviceType")).optional().array().getRule()
    );
    validationBag.set(
      "project",
      Validation.make(this.get("project")).optional().array().getRule()
    );

    validationBag.set(
      "isCachier",
      Validation.make(this.get("isCachier")).mandatory().boolean().getRule()
    );
    validationBag.set(
      "isCachier",
      Validation.make(this.get("isCachier")).optional().boolean().getRule()
    );
    validationBag.set(
      "profilePicture",
      Validation.make(this.get("profilePicture")).optional().string().getRule()
    );

    return validationBag;
  }
}
