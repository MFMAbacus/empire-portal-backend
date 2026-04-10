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

export class TaskCheckOutService {
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
      return Result.fail(Failure.badRequest());
    }
    if (attendanceRecord.status === "check-out") {
      return Result.fail(Failure.badRequest());
    }

    const attendanceData = taskRecord.attendance.find((record) => {
      if (record.staffId === input.sessionRecord.userId) {
        record.status = "check-out";
        record.date = DateTime.now().toString();
        return record;
      }
    });

    await this._taskRepository.updateDocs(
      attendanceData,
      TaskAttendance,
      "attendance"
    );

    await transactionService.logTaskCheckedOut(
      taskRecord,
      attendanceData?.staffName ?? "-"
    );

    return Result.ok(undefined);
  }
}
