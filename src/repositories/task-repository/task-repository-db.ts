import {
  ISubTaskRecord,
  ITaskAttendance,
  ITaskRecord,
  ITaskUpdate,
  Task,
  TaskAttendance,
} from "@/schemas/tasks-schema";
import { TaskRepository } from "./task-repository";
import { MongoRepository } from "@/utility/mongo-repository";
import { TaskUpdate } from "@/schemas/tasks-schema";
import mongoose, { Model, Models } from "mongoose";

export class TaskRepositoryDb extends MongoRepository<ITaskRecord> {
  public constructor() {
    super(Task);
  }

  //   get all par muja task record populate hoa hoa b chahiya
  public async getAll(): Promise<ITaskRecord[]> {
    return await super.getAll({}, ["subTasks", "attendance", "updates"]);
  }

  public async getAllLean(): Promise<ITaskRecord[]> {
    return Task.find().populate("updates").lean<ITaskRecord[]>().exec();
  }

  public async get(id: string): Promise<ITaskRecord | undefined> {
    return super.get(id, ["subTasks", "attendance", "updates"]);
  }

  public async Exists(id: String): Promise<boolean> {
    const count = await this.exists(id);
    return count;
  }

  public async Create(record: ITaskRecord): Promise<void> {
    const createdUpdates = await TaskUpdate.create(record.updates);
    record.updates = createdUpdates;
    await super.create(record);
  }

  public async Update(
    record: ITaskRecord,
    updateData: ITaskUpdate | ISubTaskRecord | ITaskAttendance,
    _model: mongoose.Model<any>,
    name: "subTasks" | "attendance" | "updates",
  ): Promise<void> {
    if (_model && name) {
      const addData: any = await _model.create(updateData);

      record[name].push(addData._id);
    }
    await super.update(record);
  }

  public async updateDocs(
    record: ITaskAttendance | ISubTaskRecord,
    _model: mongoose.Model<any>,
    name: "subTasks" | "attendance" | "updates",
  ): Promise<void> {
    if (name === "attendance") {
      const { _id, staffId, staffName, status, date } =
        record as ITaskAttendance;
      await _model.findOneAndUpdate(
        { staffId, _id },
        { staffName, status, date },
        { new: true },
      );
    } else if (name === "subTasks") {
      const { id, _id, title, staffId, staffName, isComplete, completedAt } =
        record as ISubTaskRecord;

      await _model.findOneAndUpdate(
        { id, _id },
        { title, staffName, staffId, isComplete, completedAt },
        { new: true },
      );
    }
  }

  public async Delete(id: string): Promise<void> {
    await this.delete(id);
  }
}
