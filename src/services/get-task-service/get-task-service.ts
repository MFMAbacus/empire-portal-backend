import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { ITaskRecord } from "@/schemas/tasks-schema";
import { SessionRecord } from "@/records/session-record";
import { TaskRepository } from "@/repositories/task-repository";

type Props = {
  taskRepository: TaskRepository;
};

type Input = {
  id: string;
  sessionRecord: SessionRecord;
};

export class GetTaskService {
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._taskRepository = props.taskRepository;
  }

  public async execute(input: Input): Promise<Result<ITaskRecord, Failure>> {
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

    if (input.sessionRecord.role === "staff") {
      taskRecord.subTasks.filter((subTask) => {
        return subTask.staffId === input.sessionRecord.userId;
      });
    }

    return Result.ok(taskRecord);
  }
}
