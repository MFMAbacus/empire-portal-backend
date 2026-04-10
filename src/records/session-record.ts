import {UserPermissions} from '@/schemas/session-schema/types';

export type SessionRecord = {
  id: string;
  userId: string;
  role: 'manager' | 'staff' | 'customer';
  firstName: string;
  lastName: string;
  departmentId?: string | null;
  permissions: UserPermissions;
};

