import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";

import { VehicleRecord } from "@/records/customer-record";
import { Validation } from "@/utility/validation";
import { ICustomerRecord } from "@/schemas/customer-schema/cutomer-schema";
import { IVehicleRecord } from "@/schemas/vehicle-schema/vehicle-schema";

export class CustomerModel extends Model {
  public static make(record: Partial<ICustomerRecord>): CustomerModel {
    const filteredRecord: Partial<ICustomerRecord> = {
      id: record.id,
      projectId: record.projectId,
      subProject: record.subProject,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      dateOfBirth: record.dateOfBirth,
      address: record.address,
      comments: record.comments,
      emergencyContactName: record.emergencyContactName,
      emergencyContactRelationship: record.emergencyContactRelationship,
      emergencyContactNumber: record.emergencyContactNumber,
      username: record.username,
      password: record.password,
      isInvited: record.isInvited,
      isActive: record.isActive,
      isBlocked: record.isBlocked,
      profilePicture: record.profilePicture,
    };
    return new CustomerModel(Model._makeAttributes(filteredRecord));
  }

  public invite(): void {
    this.set("isInvited", true);
  }

  public block(): void {
    this.set("isBlocked", true);
  }

  public unblock(): void {
    this.set("isBlocked", false);
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "id",
      Validation.make(this.get("id")).mandatory().string().getRule()
    );
    validationBag.set(
      "projectId",
      Validation.make(this.get("projectId")).optional().string().getRule()
    );
    validationBag.set(
      "subProject",
      Validation.make(this.get("subProject")).optional().string().getRule()
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
      Validation.make(this.get("email")).optional().string().getRule()
    );
    validationBag.set(
      "phoneNumber",
      Validation.make(this.get("phoneNumber")).mandatory().string().getRule()
    );
    validationBag.set(
      "dateOfBirth",
      Validation.make(this.get("dateOfBirth")).optional().date().getRule()
    );
    validationBag.set(
      "address",
      Validation.make(this.get("address")).optional().string().getRule()
    );
    validationBag.set(
      "comments",
      Validation.make(this.get("comments")).optional().string().getRule()
    );
    validationBag.set(
      "emergencyContactName",
      Validation.make(this.get("emergencyContactName"))
        .optional()
        .string()
        .getRule()
    );
    validationBag.set(
      "emergencyContactRelationship",
      Validation.make(this.get("emergencyContactRelationship"))
        .optional()
        .string()
        .getRule()
    );
    validationBag.set(
      "emergencyContactNumber",
      Validation.make(this.get("emergencyContactNumber"))
        .optional()
        .string()
        .getRule()
    );
    validationBag.set(
      "isInvited",
      Validation.make(this.get("isInvited")).mandatory().boolean().getRule()
    );
    validationBag.set(
      "isActive",
      Validation.make(this.get("isActive")).mandatory().boolean().getRule()
    );
    validationBag.set(
      "isBlocked",
      Validation.make(this.get("isBlocked")).mandatory().boolean().getRule()
    );
    validationBag.set(
      "profilePicture",
      Validation.make(this.get("profilePicture")).optional().string().getRule()
    );

    return validationBag;
  }
}

export class VehicleModel extends Model {
  public static make(record: Partial<IVehicleRecord>): VehicleModel {
    const filteredRecord = {
      palletNumber: record.palletNumber,
      model: record.model,
      type: record.type,
      color: record.color,
      id: record.id,
    };
    return new VehicleModel(Model._makeAttributes(filteredRecord));
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "palletNumber",
      Validation.make(this.get("palletNumber")).mandatory().string().getRule()
    );
    validationBag.set(
      "model",
      Validation.make(this.get("model")).mandatory().string().getRule()
    );
    validationBag.set(
      "type",
      Validation.make(this.get("type")).mandatory().string().getRule()
    );
    validationBag.set(
      "color",
      Validation.make(this.get("color")).mandatory().string().getRule()
    );

    return validationBag;
  }
}
