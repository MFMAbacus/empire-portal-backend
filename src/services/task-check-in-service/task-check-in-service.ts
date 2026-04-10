import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";

import { SessionRecord } from "@/records/session-record";
import { TaskRepository } from "@/repositories/task-repository";

import { TaskAttendance, TaskUpdate } from "@/schemas/tasks-schema";
import { transactionService } from "../transaction-service";

type Props = {
  taskRepository: TaskRepository;
};

type Input = {
  id: string;
  sessionRecord: SessionRecord;
};

export class TaskCheckInService {
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._taskRepository = props.taskRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);

    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const taskRecord = await this._taskRepository.get(id.get());
    if (typeof taskRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const attendanceRecord = taskRecord.attendance.find((record) => {
      return record.staffId === input.sessionRecord.userId;
    });

    if (typeof attendanceRecord === "undefined") {
      const updateData = new TaskAttendance({
        staffId: input.sessionRecord.userId,
        staffName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
        status: "check-in",
        date: DateTime.now().toString(),
      });

      await this._taskRepository.Update(
        taskRecord,
        updateData,
        TaskAttendance,
        "attendance"
      );

      await transactionService.logTaskCheckedIn(
        taskRecord,
        updateData.staffName
      );
    } else if (attendanceRecord.status === "check-in") {
      return Result.fail(Failure.badRequest());
    } else {
      let attendanceData = taskRecord.attendance.find((record) => {
        if (record.staffId === input.sessionRecord.userId) {
          record.status = "check-in";
          record.date = DateTime.now().toString();
          return record;
        }
      });

      await this._taskRepository.updateDocs(
        attendanceData,
        TaskAttendance,
        "attendance"
      );

      const updateData = new TaskUpdate({
        id: Generator.shortToken(),
        userId: input.sessionRecord.userId,
        userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
        type: "checked-in",
        date: DateTime.now().toString(),
      });

      await this._taskRepository.Update(
        taskRecord,
        updateData,
        TaskUpdate,
        "updates"
      );

      await transactionService.logTaskCheckedIn(
        taskRecord,
        updateData.userName
      );
    }

    return Result.ok(undefined);
  }
}
