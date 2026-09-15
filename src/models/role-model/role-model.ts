import { Model } from "@/utility/model";
import { ValidationBag } from "@/utility/validation-bag";

import { Validation } from "@/utility/validation";
import { IUserRole } from "@/schemas/role-schema";
export class UserRoleModel extends Model {
  public static make(record: Partial<IUserRole>): UserRoleModel {
    const filteredRecord: Partial<IUserRole> = {
      roleId:record.roleId,
      roleName:record.roleName,
    };
    return new UserRoleModel(Model._makeAttributes(filteredRecord));
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();

    validationBag.set(
      "roleId",
      Validation.make(this.get("roleId")).mandatory().string().getRule()
    );
    validationBag.set(
      "roleName",
      Validation.make(this.get("roleName")).mandatory().string().getRule()
    );
    return validationBag;
  }
}

