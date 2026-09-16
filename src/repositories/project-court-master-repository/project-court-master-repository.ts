import { IProjectCourtMaster } from "@/schemas/project-court-master-schema";

export type GetAllProjectCourtMasterOptions = {
  isArchived?: boolean;
};

export abstract class ProjectCourtMasterRepository {
  public abstract getAll(options?: GetAllProjectCourtMasterOptions): Promise<IProjectCourtMaster[]>;
  public abstract get(id: string): Promise<IProjectCourtMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IProjectCourtMaster>): Promise<IProjectCourtMaster>;
  public abstract Update(record: Partial<IProjectCourtMaster>): Promise<IProjectCourtMaster | undefined>;
  public abstract delete(id: string): Promise<IProjectCourtMaster | null>;
}
