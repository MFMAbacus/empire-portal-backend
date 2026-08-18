import { PaymentMethod } from "@/records/payment-record";

export type RequestItemRecord = {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

type RequestRateRecord = {
  value: number;
  comment: string;
};

export type RequestUpdateType =
  | "created"
  | "approved"
  | "refused"
  | "activated"
  | "completed"
  | "rated"
  | "items-set"
  | "payment";

export type RequestPriority = "low" | "medium" | "hight";

export type RequestUpdate = {
  id: string;
  userId: string;
  userName: string;
  type: RequestUpdateType;
  date: string;
};

export type RequestPaymentRecord = {
  id: string;
  method: PaymentMethod;
  amount: number;
  date: string;
};

export type RequestVisitTime = "none" | "morning" | "afternoon";

export type RequestType = "general" | "buy" | "maintenance";

export type RequestRecord = {
  id: string;
  type: RequestType;
  categoryId: string;
  categoryName: string;
  project: string | null;
  subCategoryName: string | null;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  staffId: string | null;
  staffName: string | null;
  salesPersonId: string | null;
  unitId: string;
  unitName: string;
  status: string;
  priority: RequestPriority;
  visitDate: string;
  visitTime: RequestVisitTime;
  totalPrice: number;
  totalPayments: number;
  isApproved: boolean;
  approvedAt: string | null;
  approveRemarks: string | null;
  isRefused: boolean;
  refusedAt: string | null;
  refuseRemarks: string | null;
  completedAt: string | null;
  completeRemarks: string | null;
  completeAttachments: string[];
  items: RequestItemRecord[];
  attachments: string[];
  updates: RequestUpdate[];
  payments: RequestPaymentRecord[];
  rate: RequestRateRecord | null;
  isIntangible: boolean;
  pin: string | null;
  buyAttachments: string[];
  creationDate: string;
  isArchived: boolean;
};
