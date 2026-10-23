import { Migration } from "./migration-runner";
import { Customer } from "@/schemas/customer-schema"; // Brackets add kar diye hain

export const AddIsResidentToCustomersMigration: Migration = {
  name: "AddIsResidentToCustomers",
  version: "003",
  description: "Add isResident field to existing customer records where missing",

  async up(): Promise<void> {
    // Sirf un records ko update karega jahan isResident field mojood nahi hai
    const result = await Customer.updateMany(
      { isResident: { $exists: false } },
      { $set: { isResident: false } }
    ).exec();

    console.log(
      `   📝 Updated ${result.modifiedCount} customer records with missing isResident field`
    );
  },

  async down(): Promise<void> {
    // Rollback karne par un records se isResident field wapas remove ho jayega
    const result = await Customer.updateMany(
      { isResident: false },
      { $unset: { isResident: "" } }
    ).exec();

    console.log(
      `   🗑️ Removed isResident field from ${result.modifiedCount} customer records`
    );
  },
};