import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {RequestRepository} from '@/repositories/request-repository';
import {SessionRecord} from '@/records/session-record';
import {TaskRepository} from '@/repositories/task-repository';
import {MeetingRepository} from '@/repositories/meeting-repository';
import {DateTime} from '@/utility/date-time';

type Props = {
  requestRepository: RequestRepository;
  taskRepository: TaskRepository;
  meetingRepository: MeetingRepository;
};

type Input = {
  sessionRecord: SessionRecord;
};

export class GetCountsService {
  protected _requestRepository: RequestRepository;
  protected _taskRepository: TaskRepository;
  protected _meetingRepository: MeetingRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._taskRepository = props.taskRepository;
    this._meetingRepository = props.meetingRepository;
  }

  public async execute(input: Input): Promise<Result<Counts, Failure>> {
    const role = input.sessionRecord.role;
    const userId = input.sessionRecord.userId;

    const requestsRecords = await this._requestRepository.getAll();
    const requests = requestsRecords.filter((current) => {
      if (role === 'customer') {
        return current.customerId === userId;
      }
      if (role === 'staff') {
        return current.staffId === userId;
      }
      return true;
    });
    const openRequests = requests.filter((current) => {
      return current.status !== 'completed';
    }).length;

    const tasksRecords = await this._taskRepository.getAll();
    const tasks = tasksRecords.filter((current) => {
      if (role === 'customer') {
        return current.customerId === userId;
      }
      if (role === 'staff') {
        return current.staffId === userId;
      }
      return true;
    });
    const openTasks = tasks.filter((current) => {
      return current.status !== 'complete' && !current.isClosed;
    }).length;

    const meetingsRecords = await this._meetingRepository.getAll();
    const today = DateTime.now().toString();
    const meetings = meetingsRecords.filter((current) => {
      if (role === 'staff') {
        let isInvited = false;
        current.invitation.forEach((invitation) => {
          if (invitation.staffId === userId) {
            isInvited = true;
          }
        });
        const date = DateTime.parse(`${current.date} ${current.time}`)
            .toString();
        return isInvited && today <= date;
      }
      return false;
    });

    return Result.ok({
      openRequests,
      closedRequests: requests.length - openRequests,
      openTasks,
      closedTasks: tasks.length - openTasks,
      upcomingMeetings: meetings.length,
    });
  }
}

type Counts = {
  openRequests: number;
  closedRequests: number;
  openTasks: number;
  closedTasks: number;
  upcomingMeetings: number;
};
