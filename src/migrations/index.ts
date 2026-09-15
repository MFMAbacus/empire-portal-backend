import { MigrationRunner } from "./migration-runner";
import { CreateGeneralConfigurationsMigration } from "./001-create-general-configurations";
import { CreateUserRolesMigration } from "./002-create-role";

// Register all migrations in order
MigrationRunner.register(CreateGeneralConfigurationsMigration);
MigrationRunner.register(CreateUserRolesMigration);

// Add future migrations here:
// MigrationRunner.register(SomeOtherMigration);

export { MigrationRunner };