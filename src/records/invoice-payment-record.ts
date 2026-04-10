export type InvoicePaymentItemRecord = {
  id: string;
  type: string;
  sapInvoiceId: string;
  cardCode: string;
  amount: number;
  date: string;
};

export type InvoicePaymentRecord = {
  id: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  items: InvoicePaymentItemRecord[];
  sapInvoiceIds: string[];
  method: 'fib' | 'credit-card' | 'fast-pay';
  createdAt: string;
  isConfirmed: boolean;
  confirmedAt: string | null;
  remarks: string | null;
};
