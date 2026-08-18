import { MigrationRunner } from "./migration-runner";
import { CreateGeneralConfigurationsMigration } from "./001-create-general-configurations";

// Register all migrations in order
MigrationRunner.register(CreateGeneralConfigurationsMigration);

// Add future migrations here:
// MigrationRunner.register(SomeOtherMigration);

export { MigrationRunner };