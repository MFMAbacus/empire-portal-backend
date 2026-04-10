import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { SessionRecord } from "@/records/session-record";
import { TaskRepository } from "@/repositories/task-repository";
import { ITaskRecord, ISubTaskRecord } from "@/schemas/tasks-schema";

type Props = {
  taskRepository: TaskRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  isArchived?: boolean;
};

export class GetTasksService {
  protected _taskRepository: TaskRepository;

  public constructor(props: Props) {
    this._taskRepository = props.taskRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<Partial<ITaskRecord[]>, Failure>> {
    let tasksRecords = await this._taskRepository.getAll();

    tasksRecords = tasksRecords.filter((current) => {
      return current.isArchived === Boolean(input.isArchived);
    });

    if (input.sessionRecord.role === "staff") {
      tasksRecords = tasksRecords
        .filter((task) => {
          return (
            task.staffId === input.sessionRecord.userId ||
            task.subTasks.some(
              (subTask) => subTask.staffId === input.sessionRecord.userId
            )
          );
        })
        .map((task) => {
          const subTasks = task.subTasks.filter((subTask) => {
            return subTask.staffId === input.sessionRecord.userId;
          });

          return {
            ...task.toObject(),
            subTasks: subTasks.map((subTask) =>
              subTask.toObject()
            ) as ISubTaskRecord[],
          } as ITaskRecord;
        });
    }

    return Result.ok(tasksRecords);
  }
}
