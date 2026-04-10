import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";

import { TaskRepository } from "@/repositories/task-repository";
import { SessionRecord } from "@/records/session-record";

import { TaskUpdate } from "@/schemas/tasks-schema";
import { transactionService } from "../transaction-service";

type Props = {
  taskRepository: TaskRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  id: string;
  remarks: string | null;
  attachments?: string[];
};

export class CloseTaskService {
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

    taskRecord.isClosed = true;
    taskRecord.closedAt = DateTime.now().toString();

    const updateData = new TaskUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "closed",
      date: DateTime.now().toString(),
    });

    await this._taskRepository.Update(
      taskRecord,
      updateData,
      TaskUpdate,
      "updates"
    );

    await transactionService.logTaskClosed(taskRecord);

    return Result.ok(undefined);
  }
}
