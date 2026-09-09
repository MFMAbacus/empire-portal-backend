import { IQRConfigurationMaster } from "@/schemas/qr-configuration-master-schema";

export type GetAllQRConfigurationMasterOptions = {
  isArchived?: boolean;
};

export abstract class QRConfigurationMasterRepository {
  public abstract getAll(options?: GetAllQRConfigurationMasterOptions): Promise<IQRConfigurationMaster[]>;
  public abstract get(id: string): Promise<IQRConfigurationMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IQRConfigurationMaster>): Promise<IQRConfigurationMaster>;
  public abstract Update(record: Partial<IQRConfigurationMaster>): Promise<IQRConfigurationMaster | undefined>;
  public abstract delete(id: string): Promise<IQRConfigurationMaster | null>;
}
