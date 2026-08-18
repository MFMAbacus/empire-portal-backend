import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { ValidationBag } from "@/utility/validation-bag";
import { ValidationRule } from "@/utility/validation-rule";
import { Generator } from "@/utility/generator";
import { DateTime } from "@/utility/date-time";

import { UserRepository } from "@/repositories/user-repository";
import { TaskRepository } from "@/repositories/task-repository";
import { TaskUpdate } from "@/schemas/tasks-schema";
import { SessionRecord } from "@/records/session-record";
import NotificationFCM from "@/utility/notification/notification";
import { getTokensByUserId } from "@/data/clients-sessions";
import { transactionService } from "../transaction-service";

type Props = {
  userRepository: UserRepository;
  taskRepository: TaskRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  id: string;
  staffId: string;
};

export class AssignTaskService {
  protected _userRepository: UserRepository;
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._userRepository = props.userRepository;
    this._taskRepository = props.taskRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);
    const staffId = Attribute.make(input.staffId);

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

    const updateData = new TaskUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "activated",
      date: DateTime.now().toString(),
    });

    taskRecord.staffId = staffId.get();
    taskRecord.staffName = staffName;
    taskRecord.status = "active";

    await this._taskRepository.Update(
      taskRecord,
      updateData,
      TaskUpdate,
      "updates"
    );

    await transactionService.logTaskAssigned(taskRecord);

    if (taskRecord.staffId) {
      const staffTokens = getTokensByUserId(staffId.get());
      if (staffTokens.length > 0) {
        await NotificationFCM.getInstance().sendToMany(
          {
            messageId: Generator.id(),
            title: "Task Assigned",
            body: `Dear ${taskRecord.staffName},
    Task ${taskRecord.id} has been assigned to you.`,
            id: taskRecord.id,
            type: "task",
          },
          staffTokens
        );
      }
    }

    return Result.ok(undefined);
  }
}
