export type PaymentItemRecord = {
  row: number;
  requestId: string;
  staffId: string | null;
  totalAmount: number;
  categoryName: string;
};

export type PaymentMethod =
  | "cash"
  | "credit"
  | "fib"
  | "credit-card"
  | "fast-pay";

export type PaymentRecord = {
  uuid?: string;
  id: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  staffId: string | null;
  staffName: string | null;
  totalAmount: number;
  commissionAmount: string;
  submittedAmount: number;
  requestsIds: string[];
  items: PaymentItemRecord[];
  method: PaymentMethod;
  createdAt: string;
  isConfirmed: boolean;
  confirmedAt: string | null;
  isSubmitted: boolean;
  submittedAt: string | null;
  remarks: string | null;
};
