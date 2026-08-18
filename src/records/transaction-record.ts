import { RequestType } from "./request-record";

export enum TransactionType {
  BUY_UTILITY = "Buy Utility",
  MAINTENANCE_REQUEST = "Maintenance Request",
  GENERAL = "General",
  SERVICE_PAYMENT = "Service Payment",
}

export const RequestTypeTransactionMap: Record<RequestType, TransactionType> = {
  buy: TransactionType.BUY_UTILITY,
  maintenance: TransactionType.MAINTENANCE_REQUEST,
  general: TransactionType.GENERAL,
};

export enum TransactionStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  FINISHED = "Finished",
  CANCELLED = "Cancelled",
  ARCHIVED = "Archived",
  REQUEST_ASSIGNED = "Request Assigned",
  REQUEST_APPROVED = "Request Approved",
  REQUEST_COMPLETED = "Request Completed",
  REQUEST_CREATED = "Request Created",
  REQUEST_RATED = "Request Rated",
  REQUEST_DELETED = "Request Deleted",
  REQUEST_ITEMS_SET = "Request Items Set",
  REQUEST_PIN_SET = "Request Pin Set",
  PAYMENT_CREATED = "Payment Created",
  PAYMENT_CONFIRMEND = "Payment Confirmed",
  PAYMENT_FAILED = "Payment Failed",
  B1_CREATE_INVOICE_FAILED = "B1 Create Invoice Failed",
  TASK_CREATED = "Task Created",
  TASK_ASSIGNED = "Task Assigned",
  TASK_COMPLETED = "Task Completed",
  TASK_CLOSED = "Task Closed",
  TASK_DELETED = "Task Deleted",
  REQUEST_REFUSED = "Request Refused",
  TASK_PAUSED = "Task Paused",
  TASK_RESUMED = "Task Resumed",
  TASK_CHECKED_IN = "Task Checked In",
  TASK_CHECKED_OUT = "Task Checked Out",
  SUB_TASK_CREATED = "Sub Task Created",
  SUB_TASK_ASSIGNED = "Sub Task Assigned",
  SUB_TASK_COMPLETED = "Sub Task Completed",
}

export interface ITransactionRecord {
  id: string;
  type: TransactionType;
  subType: string;
  status: TransactionStatus;
  amount: string;
  transactionRefCode?: string;
  sapRefCode?: string;
  message?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PaymentTypes {
  REQUEST_PAYMENT = "Request Payment",
  INVOICE_PAYMENT = "Invoice Payment",
}

export enum RequestTypes {
  REQUEST_CREATED = "Request Created",
  REQUEST_ASSIGNED = "Request Assigned",
  REQUEST_APPROVED = "Request Approved",
  REQUEST_COMPLETED = "Request Completed",
  REQUEST_REFUSED = "Request Refused",
  REQUEST_RATED = "Request Rated",
  REQUEST_DELETED = "Request Deleted",
  REQUEST_ITEMS_SET = "Request Items Set",
  REQUEST_PIN_SET = "Request Pin Set",
}

export enum TaskTypes {
  TASK_CREATED = "Task Created",
  TASK_ASSIGNED = "Task Assigned",
  TASK_COMPLETED = "Task Completed",
  TASK_CLOSED = "Task Closed",
  TASK_PAUSED = "Task Paused",
  TASK_RESUMED = "Task Resumed",
  TASK_CHECKED_IN = "Task Checked In",
  TASK_CHECKED_OUT = "Task Checked Out",
  TASK_DELETED = "Task Deleted",
  SUB_TASK_CREATED = "Sub Task Created",
  SUB_TASK_ASSIGNED = "Sub Task Assigned",
  SUB_TASK_COMPLETED = "Sub Task Completed",
}
