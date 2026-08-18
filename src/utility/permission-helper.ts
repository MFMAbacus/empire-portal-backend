import {
  UserPermissions,
  BasePermission,
  PermissionChecker,
  SubSectionWithActions,
} from "@/schemas/session-schema/types";

export class PermissionHelper {
  static createChecker(permissions: UserPermissions): PermissionChecker {
    return new PermissionChecker(permissions);
  }

  static createDefaultPermissions(): UserPermissions {
    return {
      activities: {
        read: false,
        write: false,
        subSections: {
          tasks: { read: false, write: false },
          requests: {
            read: false,
            write: false,
            actions: {
              receiveCredit: { allowed: false },
            },
          },
        },
      },
      meeting: {
        read: false,
        write: false,
        subSections: {
          meetings: { read: false, write: false },
          meetingInvite: { read: false, write: false },
        },
      },
      customers: {
        read: false,
        write: false,
        actions: {
          sendingInvitation: { allowed: false },
          blocking: { allowed: false },
        },
      },
      inventory: {
        read: false,
        write: false,
        actions: {
          displayPrices: { allowed: false },
        },
      },
      announcements: { read: false, write: false },
      userManagement: { read: false, write: false },
      welcomescreenMedia: { read: false, write: false },
      collection: { read: false, write: false },
    };
  }

  static migrateOldPermissions(oldPermissions: {
    [key: string]: { read: boolean; write: boolean };
  }): UserPermissions {
    const newPermissions = this.createDefaultPermissions();

    if (oldPermissions.activities) {
      newPermissions.activities = {
        read: oldPermissions.activities.read,
        write: oldPermissions.activities.write,
        subSections: {
          tasks: {
            read: oldPermissions.activities.read,
            write: oldPermissions.activities.write,
          },
          requests: {
            read: oldPermissions.activities.read,
            write: oldPermissions.activities.write,
            actions: {
              receiveCredit: {
                allowed: oldPermissions.credit
                  ? oldPermissions.credit.write
                  : false,
              },
            },
          },
        },
      };
    }

    if (oldPermissions.customers) {
      newPermissions.customers = {
        read: oldPermissions.customers.read,
        write: oldPermissions.customers.write,
        actions: {
          sendingInvitation: { allowed: oldPermissions.customers.write },
          blocking: { allowed: oldPermissions.customers.write },
        },
      };
    }

    if (oldPermissions.inventory) {
      newPermissions.inventory = {
        read: oldPermissions.inventory.read,
        write: oldPermissions.inventory.write,
        actions: {
          displayPrices: { allowed: oldPermissions.inventory.read },
        },
      };
    }

    if (oldPermissions.announcements) {
      newPermissions.announcements = {
        read: oldPermissions.announcements.read,
        write: oldPermissions.announcements.write,
      };
    }

    if (oldPermissions.userManagement) {
      newPermissions.userManagement = {
        read: oldPermissions.userManagement.read,
        write: oldPermissions.userManagement.write,
      };
    }

    if (oldPermissions["welcomescreen-media"]) {
      newPermissions.welcomescreenMedia = {
        read: oldPermissions["welcomescreen-media"].read,
        write: oldPermissions["welcomescreen-media"].write,
      };
    }

    return newPermissions;
  }

  static validatePermissions(permissions: UserPermissions): boolean {
    try {
      if (permissions.activities) {
        if (
          typeof permissions.activities.read !== "boolean" ||
          typeof permissions.activities.write !== "boolean"
        ) {
          return false;
        }
        if (permissions.activities.subSections) {
          for (const [key, value] of Object.entries(
            permissions.activities.subSections
          )) {
            if (
              typeof value.read !== "boolean" ||
              typeof value.write !== "boolean"
            ) {
              return false;
            }
          }
        }
      }

      if (permissions.customers && permissions.customers.actions) {
        for (const [key, value] of Object.entries(
          permissions.customers.actions
        )) {
          if (typeof value.allowed !== "boolean") {
            return false;
          }
        }
      }

      if (permissions.inventory && permissions.inventory.actions) {
        for (const [key, value] of Object.entries(
          permissions.inventory.actions
        )) {
          if (typeof value.allowed !== "boolean") {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static mergePermissions(
    basePermissions: UserPermissions,
    updatePermissions: Partial<UserPermissions>
  ): UserPermissions {
    const merged: any = JSON.parse(JSON.stringify(basePermissions));

    for (const [moduleName, modulePerms] of Object.entries(updatePermissions)) {
      if (modulePerms) {
        if (!merged[moduleName]) {
          merged[moduleName] = modulePerms;
        } else {
          Object.assign(merged[moduleName], modulePerms);

          if ((modulePerms as any).subSections) {
            if (!merged[moduleName].subSections) {
              merged[moduleName].subSections = {};
            }
            Object.assign(
              merged[moduleName].subSections,
              (modulePerms as any).subSections
            );
          }

          if ((modulePerms as any).actions) {
            if (!merged[moduleName].actions) {
              merged[moduleName].actions = {};
            }
            Object.assign(
              merged[moduleName].actions,
              (modulePerms as any).actions
            );
          }
        }
      }
    }

    return merged as UserPermissions;
  }
}
