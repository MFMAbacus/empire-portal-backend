import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { SubTaskModel } from "@/models/task-model";
import { TaskRepository } from "@/repositories/task-repository";
import { SubTaskRecord } from "@/schemas/tasks-schema";
import { transactionService } from "../transaction-service";

type Props = {
  taskRepository: TaskRepository;
};

type Input = {
  taskId: string;
  title: string;
};

export class CreateSubTaskService {
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._taskRepository = props.taskRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
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

    const subTaskModel = SubTaskModel.make({
      id: Generator.id("ST"),
      title: input.title,
      staffId: null,
      staffName: null,
      isComplete: false,
      completedAt: null,
    });

    const validationBag = subTaskModel.validate();

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const updateData = new SubTaskRecord({
      id: subTaskModel.get("id"),
      title: input.title,
      staffId: null,
      staffName: null,
      isComplete: false,
      completedAt: null,
    });

    await this._taskRepository.Update(
      taskRecord,
      updateData,
      SubTaskRecord,
      "subTasks"
    );

    await transactionService.logSubTaskCreated(taskRecord, updateData);

    return Result.ok(subTaskModel.get("id"));
  }
}
