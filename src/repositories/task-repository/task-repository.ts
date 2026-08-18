import {
  ISubTaskRecord,
  ITaskAttendance,
  ITaskRecord,
  ITaskUpdate,
} from "@/schemas/tasks-schema";
import { TaskRecord } from "@/schemas/tasks-schema/types";

export abstract class TaskRepository {
  public abstract getAll(): Promise<ITaskRecord[]>;
  public abstract getAllLean(): Promise<ITaskRecord[]>;
  public abstract get(id: string): Promise<ITaskRecord | undefined>;
  public abstract Exists(id: string): Promise<boolean>;
  public abstract Create(record: ITaskRecord): Promise<void>;
  public abstract Update(
    record: ITaskRecord,
    updateData?: ITaskUpdate | ISubTaskRecord | ITaskAttendance,
    model?: any,
    name?: "subTasks" | "attendance" | "updates"
  ): Promise<void>;
  public abstract updateDocs(
    record: ITaskAttendance | ISubTaskRecord | undefined,
    model: any,
    name: "subTasks" | "attendance" | "updates"
  ): Promise<void>;

  public abstract delete(id: string): Promise<ITaskRecord | null>;
}
