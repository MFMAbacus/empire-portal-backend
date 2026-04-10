export type SubTaskRecord = {
  id: string;
  title: string;
  staffId: string | null;
  staffName: string | null;
  isComplete: boolean;
  completedAt: string | null;
};

export type TaskAttendanceStatus = "check-in" | "check-out";

export type TaskAttendance = {
  staffId: string;
  staffName: string;
  status: TaskAttendanceStatus;
  date: string;
};

export type TaskUpdateType =
  | "created"
  | "activated"
  | "completed"
  | "paused"
  | "resumed"
  | "checked-in"
  | "checked-out"
  | "closed";

export type TaskUpdate = {
  id: string;
  userId: string;
  userName: string;
  type: TaskUpdateType;
  date: string;
};

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskRecord = {
  id: string;
  categoryId: string;
  categoryName: string;
  customerId: string | null;
  customerName: string | null;
  projectId: string | null;
  title: string;
  description: string;
  status: string;
  visitDate: string;
  visitTime: string;
  priority: TaskPriority;
  staffId: string | null;
  staffName: string | null;
  creationDate: string;
  dueDate: string;
  completedAt: string | null;
  completeRemarks: string | null;
  completeAttachments: string[];
  isClosed: boolean;
  closedAt: string | null;
  subTasks: SubTaskRecord[];
  attendance: TaskAttendance[];
  updates: TaskUpdate[];
  attachments: string[];
  isArchived: boolean;
  bls: string[];
  fls: string[];
};
