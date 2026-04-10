import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { TaskRepository } from "@/repositories/task-repository";
import { transactionService } from "../transaction-service";

type Props = {
  taskRepository: TaskRepository;
};

type Input = {
  id: string;
  isRestore?: boolean;
};

export class DeleteTaskService {
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._taskRepository = props.taskRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
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

    taskRecord.isArchived = !input.isRestore;

    await this._taskRepository.Update(taskRecord);

    await transactionService.logTaskDeleted(taskRecord);

    return Result.ok(taskRecord.id);
  }
}
