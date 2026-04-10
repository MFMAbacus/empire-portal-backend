import { User } from "@/schemas/user-schema";
import { Session } from "@/schemas/session-schema";
import { PermissionHelper } from "./permission-helper";

export class PermissionMigration {
  
  static async migrateAllUsers(): Promise<void> {
    console.log("Starting permission migration for users...");
    
    try {
      const users = await User.find({}).exec();
      let migratedCount = 0;
      
      for (const user of users) {
        try {
          if (user.permissions && typeof user.permissions === 'object') {
            const isOldFormat = this.isOldPermissionFormat(user.permissions);
            
            if (isOldFormat) {
              const newPermissions = PermissionHelper.migrateOldPermissions(user.permissions as any);
              
              await User.findByIdAndUpdate(user._id, {
                permissions: newPermissions
              });
              
              migratedCount++;
              console.log(`Migrated user: ${user.email} (${user.id})`);
            }
          } else {
            const defaultPermissions = PermissionHelper.createDefaultPermissions();
            await User.findByIdAndUpdate(user._id, {
              permissions: defaultPermissions
            });
            
            migratedCount++;
            console.log(`Set default permissions for user: ${user.email} (${user.id})`);
          }
        } catch (userError) {
          console.error(`Error migrating user ${user.id}:`, userError);
        }
      }
      
      console.log(`Successfully migrated ${migratedCount} users`);
    } catch (error) {
      console.error("Error during user permission migration:", error);
      throw error;
    }
  }
  
  static async migrateAllSessions(): Promise<void> {
    console.log("Starting permission migration for sessions...");
    
    try {
      const sessions = await Session.find({}).exec();
      let migratedCount = 0;
      
      for (const session of sessions) {
        try {
          if (session.permissions && typeof session.permissions === 'object') {
            const isOldFormat = this.isOldPermissionFormat(session.permissions);
            
            if (isOldFormat) {
              const newPermissions = PermissionHelper.migrateOldPermissions(session.permissions as any);
              
              await Session.findByIdAndUpdate(session._id, {
                permissions: newPermissions
              });
              
              migratedCount++;
              console.log(`Migrated session: ${session.id}`);
            }
          } else {
            const defaultPermissions = PermissionHelper.createDefaultPermissions();
            await Session.findByIdAndUpdate(session._id, {
              permissions: defaultPermissions
            });
            
            migratedCount++;
            console.log(`Set default permissions for session: ${session.id}`);
          }
        } catch (sessionError) {
          console.error(`Error migrating session ${session.id}:`, sessionError);
        }
      }
      
      console.log(`Successfully migrated ${migratedCount} sessions`);
    } catch (error) {
      console.error("Error during session permission migration:", error);
      throw error;
    }
  }
  
  static async migrateAll(): Promise<void> {
    console.log("Starting complete permission migration...");
    
    await this.migrateAllUsers();
    await this.migrateAllSessions();
    
    console.log("Permission migration completed successfully!");
  }
  
  private static isOldPermissionFormat(permissions: any): boolean {
    if (!permissions || typeof permissions !== 'object') {
      return false;
    }
    
    for (const [key, value] of Object.entries(permissions)) {
      if (value && typeof value === 'object') {
        const hasReadWrite = 'read' in value && 'write' in value && 
                           typeof value.read === 'boolean' && 
                           typeof value.write === 'boolean';
        
        const hasNoSubSections = !('subSections' in value);
        const hasNoActions = !('actions' in value);
        
        if (hasReadWrite && hasNoSubSections && hasNoActions) {
          return true;
        }
      }
    }
    
    return false;
  }
}

if (require.main === module) {
  PermissionMigration.migrateAll()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}