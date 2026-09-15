import { Migration } from "./migration-runner";
import UserRole from "@/schemas/role-schema";
import { Generator } from "@/utility/generator";

export const CreateUserRolesMigration: Migration = {
  name: "CreateUserRoles",
  version: "001",
  description: "Create initial default user roles records",

  async up(): Promise<void> {
    const existingRoles = await UserRole.find({}).exec();

    if (existingRoles.length > 0) {
      console.log(
        `   ⏭️  Skipping - ${existingRoles.length} user roles already exist`
      );
      return;
    }

    const defaultRoles = [
      {
        id: Generator.uuid("UR"),
        roleId: "1",
        roleName: "Admin",
      },
      {
        id: Generator.uuid("UR"),
        roleId: "2",
        roleName: "Security",
      },
      {
        id: Generator.uuid("UR"),
        roleId: "3",
        roleName: "Guard",
      },
      {
        id: Generator.uuid("UR"),
        roleId: "4",
        roleName: "Property Management",
      },
      {
        id: Generator.uuid("UR"),
        roleId: "5",
        roleName: "Restaurant Staff",
      },
      {
        id: Generator.uuid("UR"),
        roleId: "6",
        roleName: "Facility Staff",
      },
      {
        id: Generator.uuid("UR"),
        roleId: "7",
        roleName: "Card Staff",
      },
    ];

    for (const role of defaultRoles) {
      await UserRole.create(role);
    }

    console.log(
      `   📝 Created ${defaultRoles.length} user role records`
    );
  },

  async down(): Promise<void> {
    const roleNames = [
      "Admin",
      "Security",
      "Guard",
      "Property Management",
      "Restaurant Staff",
      "Facility Staff",
      "Card Staff",
    ];

    const result = await UserRole.deleteMany({
      roleName: { $in: roleNames },
    }).exec();

    console.log(
      `   🗑️  Removed ${result.deletedCount} user role records`
    );
  },
};