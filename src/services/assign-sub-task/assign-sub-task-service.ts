import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

import { TaskRepository } from "@/repositories/task-repository";
import { UserRepository } from "@/repositories/user-repository";
import { ValidationBag } from "@/utility/validation-bag";
import { ValidationRule } from "@/utility/validation-rule";

import { SubTaskRecord } from "@/schemas/tasks-schema";
import { transactionService } from "../transaction-service";

type Props = {
  taskRepository: TaskRepository;
  userRepository: UserRepository;
};

type Input = {
  taskId: string;
  subTaskId: string;
  staffId: string;
};

export class AssignSubTaskService {
  protected _taskRepository: TaskRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._taskRepository = props.taskRepository;
    this._userRepository = props.userRepository;
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

    const staffId = Attribute.make(input.staffId);
    const validationBag = ValidationBag.make();

    validationBag.set(
      "staffId",
      Validation.make(staffId.get()).mandatory().string().getRule()
    );

    let staffName: string | null = null;
    if (!validationBag.hasError("staffId")) {
      const staffRecord = await this._userRepository.get(staffId.get());
      if (typeof staffRecord === "undefined" || !staffRecord.isMobileUser) {
        validationBag.set("staffId", ValidationRule.valueIsInvalid());
      } else {
        staffName = `${staffRecord.firstName} ${staffRecord.lastName}`;
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    subTaskRecord.staffId = input.staffId;
    subTaskRecord.staffName = staffName;

    await this._taskRepository.updateDocs(
      subTaskRecord,
      SubTaskRecord,
      "subTasks"
    );

    await transactionService.logSubTaskAssigned(
      taskRecord,
      subTaskRecord,
      subTaskRecord.staffName ?? "-"
    );

    return Result.ok(undefined);
  }
}
