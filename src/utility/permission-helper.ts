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
      masterForms: {
        read: false,
        write: false,
        subSections: {
          "property-master": { read: false, write: false },
          "apartment-master": { read: false, write: false },
          "resident-master": { read: false, write: false },
          "approval-routing-master": { read: false, write: false },
          "email-template-master": { read: false, write: false },
          "common-status-master": { read: false, write: false },
          "gate-master": { read: false, write: false },
          "guard-account-mapping-master": { read: false, write: false },
          "security-coordinator-master": { read: false, write: false },
          "vehicle-type-master": { read: false, write: false },
          "qr-configuration-master": { read: false, write: false },
          "movement-type-master": { read: false, write: false },
          "item-type-master": { read: false, write: false },
          "movement-rule-master": { read: false, write: false },
          "property-management-approval-master": { read: false, write: false },
          "access-card-master": { read: false, write: false },
          "card-replacement-reason-master": { read: false, write: false },
          "replacement-fee-master": { read: false, write: false },
          "access-card-staff-master": { read: false, write: false },
          "delivery-sla-master": { read: false, write: false },
          "payment-method-master": { read: false, write: false },
          "venue-master": { read: false, write: false },
          "menu-master": { read: false, write: false },
          "venue-operating-master": { read: false, write: false },
          "restaurant-staff-master": { read: false, write: false },
          "project-venue-master": { read: false, write: false },
          "reservation-rule-master": { read: false, write: false },
          "court-master": { read: false, write: false },
          "court-operating-master": { read: false, write: false },
          "court-time-master": { read: false, write: false },
          "court-blocking-master": { read: false, write: false },
          "project-court-master": { read: false, write: false },
          "court-booking-master": { read: false, write: false },
          "facility-approval-master": { read: false, write: false },
          "guest-approval-master": { read: false, write: false },
          "move-approval-master": { read: false, write: false },
          "card-processing-master": { read: false, write: false },
          "restaurant-reservation-approval-master": { read: false, write: false },
          "court-approval-master": { read: false, write: false },
          "request-history-master": { read: false, write: false },
          "audit-logs-master": { read: false, write: false },
        },
      },
    };
  }

  static migrateOldPermissions(oldPermissions: {
    [key: string]: any;
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

    const masterFormsData =
      oldPermissions.masterForms || oldPermissions["master-forms"];
    if (masterFormsData) {
      newPermissions.masterForms = {
        read: Boolean(masterFormsData.read),
        write: Boolean(masterFormsData.write),
        subSections: {
          ...newPermissions.masterForms!.subSections,
          ...(masterFormsData.subSections || {}),
        },
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
            const sub = value as any;
            if (
              typeof sub.read !== "boolean" ||
              typeof sub.write !== "boolean"
            ) {
              return false;
            }
            if (sub.actions) {
              for (const [actionKey, actionVal] of Object.entries(sub.actions)) {
                if (typeof (actionVal as any).allowed !== "boolean") {
                  return false;
                }
              }
            }
          }
        }
      }

      if (permissions.masterForms && permissions.masterForms.subSections) {
        for (const [key, value] of Object.entries(
          permissions.masterForms.subSections
        )) {
          const sub = value as any;
          if (
            typeof sub.read !== "boolean" ||
            typeof sub.write !== "boolean"
          ) {
            return false;
          }
        }
      }

      if (permissions.customers && permissions.customers.actions) {
        for (const [key, value] of Object.entries(
          permissions.customers.actions
        )) {
          if (typeof (value as any).allowed !== "boolean") {
            return false;
          }
        }
      }

      if (permissions.inventory && permissions.inventory.actions) {
        for (const [key, value] of Object.entries(
          permissions.inventory.actions
        )) {
          if (typeof (value as any).allowed !== "boolean") {
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
