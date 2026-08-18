import { UserPermissions } from "@/schemas/session-schema/types";

export enum BuyServiceCategoryNames {
  ELECTRICITY = "Electricity",
  INTERNET = "Internet",
  GAS_REFILLING = "Gas Refilling",
  CLEANING = "Cleaning",
}

export type UserRecord = {
  id: string;
  salespersonId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  departmentId: string | null;
  employeeId: string | null;
  jobTitle: string | null;
  password: string;
  isMobileUser: boolean;
  isCachier: boolean;
  serviceType: BuyServiceCategoryNames | null;
  permissions: UserPermissions;
  profilePicture: string | null;
  isArchived: boolean;
};
