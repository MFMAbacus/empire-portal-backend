import { IProjectVenueMaster } from "@/schemas/project-venue-master-schema";

export type GetAllProjectVenueMasterOptions = {
  isArchived?: boolean;
};

export abstract class ProjectVenueMasterRepository {
  public abstract getAll(options?: GetAllProjectVenueMasterOptions): Promise<IProjectVenueMaster[]>;
  public abstract get(id: string): Promise<IProjectVenueMaster | undefined>;
  public abstract exists(id: string): Promise<boolean>;
  public abstract Create(record: Partial<IProjectVenueMaster>): Promise<IProjectVenueMaster>;
  public abstract Update(record: Partial<IProjectVenueMaster>): Promise<IProjectVenueMaster | undefined>;
  public abstract delete(id: string): Promise<IProjectVenueMaster | null>;
}
