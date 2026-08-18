import { IPaymentItemRecord, IPaymentRecord } from "@/schemas/payment-schema";

export abstract class PaymentRepository {
  public abstract getAll(): Promise<IPaymentRecord[]>;
  public abstract get(id: string): Promise<IPaymentRecord | undefined>;
  public abstract getByUuid(id: string): Promise<IPaymentRecord | undefined>;
  public abstract Create(
    record: IPaymentRecord,
    itemRecord?: IPaymentItemRecord[],
    model?: any,
    name?: "items"
  ): Promise<void>;
  public abstract Update(record: IPaymentRecord): Promise<void>;
}
