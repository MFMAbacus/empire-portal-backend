import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";
import { Generator } from "@/utility/generator";
import { ValidationBag } from "@/utility/validation-bag";
import { optional } from "@/utility/optional";
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

export class CompleteTaskService {
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

    const remarks = Attribute.make(optional(input.remarks, null));
    const attachments = Attribute.make(optional(input.attachments, []));
    const validationBag = ValidationBag.make();

    validationBag.set(
      "remarks",
      Validation.make(remarks.get()).optional().string().getRule()
    );
    validationBag.set(
      "attachments",
      Validation.make(attachments.get()).optional().array().getRule()
    );

    if (!validationBag.hasError("attachments")) {
      // eslint-disable-next-line max-len
      for (const [index, attachment] of attachments.get().entries()) {
        validationBag.set(
          `attachments.${index}`,
          Validation.make(attachment).optional().string().getRule()
        );
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    taskRecord.status = "completed";
    taskRecord.completedAt = DateTime.now().toString();
    taskRecord.completeRemarks = remarks.get();
    taskRecord.completeAttachments = attachments.get();

    const updateData = new TaskUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "completed",
      date: DateTime.now().toString(),
    });

    await this._taskRepository.Update(
      taskRecord,
      updateData,
      TaskUpdate,
      "updates"
    );

    await transactionService.logTaskCompleted(taskRecord);

    return Result.ok(undefined);
  }
}
