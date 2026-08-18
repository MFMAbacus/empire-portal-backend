export interface BasePermission {
  read: boolean;
  write: boolean;
}

export interface ActionPermission {
  allowed: boolean;
}

export interface ActionPermissions {
  [actionName: string]: ActionPermission;
}

export interface SubSectionWithActions extends BasePermission {
  actions?: ActionPermissions;
}

export interface SubSectionPermissions {
  [subSectionName: string]: BasePermission | SubSectionWithActions;
}

export interface ModuleWithSubSections extends BasePermission {
  subSections?: SubSectionPermissions;
}

export interface ModuleWithActions extends BasePermission {
  actions?: ActionPermissions;
}

export interface UserPermissions {
  activities?: ModuleWithSubSections & {
    subSections?: {
      tasks?: BasePermission;
      requests?: SubSectionWithActions & {
        actions?: {
          receiveCredit?: ActionPermission;
        };
      };
    };
  };

  meeting?: ModuleWithSubSections & {
    subSections?: {
      meetings?: BasePermission;
      meetingInvite?: BasePermission;
    };
  };

  customers?: ModuleWithActions & {
    actions?: {
      sendingInvitation?: ActionPermission;
      blocking?: ActionPermission;
    };
  };

  inventory?: ModuleWithActions & {
    actions?: {
      displayPrices?: ActionPermission;
    };
  };

  announcements?: BasePermission;
  userManagement?: BasePermission;
  welcomescreenMedia?: BasePermission;
  collection?: BasePermission;
  transactions?: BasePermission;
  generalConfigurations?: BasePermission;
}

export class PermissionChecker {
  constructor(private permissions: UserPermissions) {}

  canRead(module: keyof UserPermissions): boolean {
    return this.permissions[module]?.read ?? false;
  }

  canWrite(module: keyof UserPermissions): boolean {
    return this.permissions[module]?.write ?? false;
  }

  canReadSubSection(
    module: "activities" | "meeting",
    subSection: string
  ): boolean {
    const modulePerms = this.permissions[module] as ModuleWithSubSections;
    return modulePerms?.subSections?.[subSection]?.read ?? this.canRead(module);
  }

  canWriteSubSection(
    module: "activities" | "meeting",
    subSection: string
  ): boolean {
    const modulePerms = this.permissions[module] as ModuleWithSubSections;
    return (
      modulePerms?.subSections?.[subSection]?.write ?? this.canWrite(module)
    );
  }

  canPerformAction(module: "customers" | "inventory", action: string): boolean {
    const modulePerms = this.permissions[module] as ModuleWithActions;
    return modulePerms?.actions?.[action]?.allowed ?? false;
  }

  canPerformSubSectionAction(
    module: "activities",
    subSection: "requests",
    action: string
  ): boolean {
    const modulePerms = this.permissions[module] as ModuleWithSubSections;
    const subSectionPerms = modulePerms?.subSections?.[
      subSection
    ] as SubSectionWithActions;
    return subSectionPerms?.actions?.[action]?.allowed ?? false;
  }
}
