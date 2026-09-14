import { IDeliverySLAMaster } from "@/schemas/delivery-sla-master-schema";

export type GetAllDeliverySLAMasterOptions = {
  isArchived?: boolean;
};

export abstract class DeliverySLAMasterRepository {
  public abstract getAll(options?: GetAllDeliverySLAMasterOptions): Promise<IDeliverySLAMaster[]>;
  public abstract get(id: string): Promise<IDeliverySLAMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IDeliverySLAMaster>): Promise<IDeliverySLAMaster>;
  public abstract Update(record: Partial<IDeliverySLAMaster>): Promise<IDeliverySLAMaster | undefined>;
  public abstract delete(id: string): Promise<IDeliverySLAMaster | null>;
}
