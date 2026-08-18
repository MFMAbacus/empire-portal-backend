import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ValidationRule } from "@/utility/validation-rule";
import { optional } from "@/utility/optional";
import { DateTime } from "@/utility/date-time";

import { TaskPriority } from "@/records/task-record";
import { TaskModel } from "@/models/task-model";
import { TaskUpdate } from "@/schemas/tasks-schema/task-update-schema"; // Ensure TaskUpdate is imported
import { SessionRecord } from "@/records/session-record";
import { CustomerRepository } from "@/repositories/customer-repository";
import { TaskRepository } from "@/repositories/task-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import { transactionService } from "../transaction-service";

type Props = {
  customerRepository: CustomerRepository;
  taskRepository: TaskRepository;
  categoryRepository: CategoryRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  categoryId: string;
  categoryName: string;
  customerId?: string | null;
  projectId: string | null;
  buildingId: string | null;
  title: string;
  description: string;
  visitDate: string;
  visitTime: string;
  priority: TaskPriority;
  dueDate: string;
  attachments?: string[];
  bls: string[];
  fls: string[];
};

export class CreateTaskService {
  protected _customerRepository: CustomerRepository;
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
    this._taskRepository = props.taskRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const updateData = new TaskUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "created",
      date: DateTime.now().toString(),
    });

    const taskModel = TaskModel.make({
      id: Generator.id("T"),
      categoryId: input.categoryId,
      categoryName: input.categoryName,
      customerId: optional(input.customerId, null),
      customerName: null,
      projectId: input.projectId,
      title: input.title,
      description: input.description,
      status: "new",
      visitDate: input.visitDate,
      visitTime: input.visitTime,
      priority: input.priority,
      staffId: null,
      staffName: null,
      creationDate: DateTime.now().toString(),
      dueDate: input.dueDate,
      completedAt: null,
      completeRemarks: null,
      completeAttachments: [],
      isClosed: false,
      closedAt: null,
      subTasks: [],
      attendance: [],
      bls: input.bls,
      fls: input.fls,
      updates: [updateData],
      attachments: optional(input.attachments, []),
      isArchived: false,
    });

    const validationBag = taskModel.validate();

    const customerId = taskModel.get<string | null>("customerId");
    if (customerId !== null) {
      if (!validationBag.hasError("customerId")) {
        const customerRecord = await this._customerRepository.get(customerId);
        if (typeof customerRecord === "undefined") {
          validationBag.set("customerId", ValidationRule.valueIsInvalid());
        } else {
          const customerName = `${customerRecord.firstName} ${customerRecord.lastName}`;
          taskModel.set("customerName", customerName);
        }
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    await this._taskRepository.Create(taskModel.getRecord());

    await transactionService.logTaskCreated(taskModel.getRecord());

    return Result.ok(taskModel.get("id"));
  }
}
