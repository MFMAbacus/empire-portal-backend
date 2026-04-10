import { IInvoicePaymentItemRecord } from "@/schemas/invoice-payment-schema";
import { IInvoicePaymentRecord } from "@/schemas/invoice-payment-schema/invoice-payment-schema";

export abstract class InvoicePaymentRepository {
  public abstract getAll(): Promise<IInvoicePaymentRecord[]>;
  public abstract get(id: string): Promise<IInvoicePaymentRecord | undefined>;
  public abstract getByUuid(
    id: string
  ): Promise<IInvoicePaymentRecord | undefined>;
  public abstract Create(
    record: IInvoicePaymentRecord,
    itemRecord?: IInvoicePaymentItemRecord[],
    model?: any,
    name?: "items"
  ): Promise<void>;
  public abstract Update(record: IInvoicePaymentRecord): Promise<void>;
}
