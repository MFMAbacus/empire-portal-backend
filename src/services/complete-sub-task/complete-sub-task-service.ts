import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { DateTime } from "@/utility/date-time";

import { TaskRepository } from "@/repositories/task-repository";
import { SubTaskRecord } from "@/schemas/tasks-schema";
import { transactionService } from "../transaction-service";

type Props = {
  taskRepository: TaskRepository;
};

type Input = {
  taskId: string;
  subTaskId: string;
};

export class CompleteSubTaskService {
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._taskRepository = props.taskRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const taskId = Attribute.make(input.taskId);
    const idValidationRule = Validation.make(taskId.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const taskRecord = await this._taskRepository.get(taskId.get());
    if (typeof taskRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    const subTaskRecord = taskRecord.subTasks.find((record) => {
      return record.id === input.subTaskId;
    });
    if (typeof subTaskRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    subTaskRecord.isComplete = true;
    subTaskRecord.completedAt = DateTime.now().toString();

    await this._taskRepository.updateDocs(
      subTaskRecord,
      SubTaskRecord,
      "subTasks"
    );

    await transactionService.logSubTaskCompleted(taskRecord, subTaskRecord);

    return Result.ok(undefined);
  }
}
