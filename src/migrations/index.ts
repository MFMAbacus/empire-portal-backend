import { MigrationRunner } from "./migration-runner";
import { CreateGeneralConfigurationsMigration } from "./001-create-general-configurations";
import { CreateUserRolesMigration } from "./002-create-role";
import { AddIsResidentToCustomersMigration } from "./003-customer-isResident";
// Register all migrations in order
MigrationRunner.register(CreateGeneralConfigurationsMigration);
MigrationRunner.register(CreateUserRolesMigration);
MigrationRunner.register(AddIsResidentToCustomersMigration);

// Add future migrations here:
// MigrationRunner.register(SomeOtherMigration);

export { MigrationRunner };