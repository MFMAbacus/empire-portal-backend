import { runMigrations } from "@/config/app";

export interface Migration {
  name: string;
  version: string;
  description: string;
  up(): Promise<void>;
  down?(): Promise<void>;
}

export class MigrationRunner {
  private static migrations: Migration[] = [];

  public static register(migration: Migration): void {
    this.migrations.push(migration);
  }

  public static async runAll(): Promise<void> {
    if (!runMigrations) {
      console.log("🚫 Migrations disabled (RUN_MIGRATIONS=false)");
      return;
    }

    console.log("🔄 Starting migrations...");

    for (const migration of this.migrations) {
      try {
        console.log(
          `📦 Running migration: ${migration.name} (${migration.version})`
        );
        console.log(`   Description: ${migration.description}`);

        await migration.up();

        console.log(`✅ Migration completed: ${migration.name}`);
      } catch (error) {
        console.error(`❌ Migration failed: ${migration.name}`, error);
        throw error;
      }
    }

    console.log("🎉 All migrations completed successfully!");
  }

  public static getRegisteredMigrations(): Migration[] {
    return [...this.migrations];
  }
}
