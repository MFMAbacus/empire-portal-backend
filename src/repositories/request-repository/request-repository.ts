import {
  IRequestRecord,
  IRequestPaymentRecord,
  IRequestItemRecord,
  IRequestUpdate,
  RequestItem,
  RequestPayment,
  RequestUpdate,
} from "@/schemas/request-schema";

export type GetAllOptions = {
  ids?: string[];
};

export abstract class RequestRepository {
  public abstract getAll(options?: GetAllOptions): Promise<IRequestRecord[]>;
  public abstract get(id: string): Promise<IRequestRecord | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: IRequestRecord): Promise<void>;
  public abstract Update(
    record: IRequestRecord,
    updateData?:
      | IRequestPaymentRecord
      | IRequestItemRecord
      | IRequestItemRecord[]
      | IRequestUpdate,
    model?: any,
    name?: "items" | "payments" | "updates"
  ): Promise<void>;
  public abstract pay(paymentRecord: any): Promise<void>;
  public abstract Delete(id: string): Promise<void>;
  public abstract itemExist(id: string): Promise<IRequestItemRecord | null>;
  public abstract deleteItem(id: string): Promise<void>;
}
