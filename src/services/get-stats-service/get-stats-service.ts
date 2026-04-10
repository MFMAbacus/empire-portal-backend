import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';
import {ValidationBag} from '@/utility/validation-bag';
import {Attribute} from '@/utility/attribute';
import {Validation} from '@/utility/validation';

import {RequestRepository} from '@/repositories/request-repository';
import {TaskRepository} from '@/repositories/task-repository';
import {CustomerRepository} from '@/repositories/customer-repository';
import {UserRepository} from '@/repositories/user-repository';
import {AnnouncementRepository} from '@/repositories/announcement-repository';
import {DateTime} from '@/utility/date-time';

type Props = {
  requestRepository: RequestRepository;
  taskRepository: TaskRepository;
  customerRepository: CustomerRepository;
  userRepository: UserRepository;
  announcementRepository: AnnouncementRepository;
};

type Input = {
  minDate?: string;
  maxDate?: string;
};

export class GetStatsService {
  protected _requestRepository: RequestRepository;
  protected _taskRepository: TaskRepository;
  protected _customerRepository: CustomerRepository;
  protected _userRepository: UserRepository;
  protected _announcementRepository: AnnouncementRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
    this._taskRepository = props.taskRepository;
    this._customerRepository = props.customerRepository;
    this._userRepository = props.userRepository;
    this._announcementRepository = props.announcementRepository;
  }

  public async execute(input: Input): Promise<Result<Counts, Failure>> {
    const minDate = Attribute.make(input.minDate);
    const maxDate = Attribute.make(input.maxDate);
    const minCreatedAt = minDate.get();
    const maxCreatedAt = maxDate.get();

    const validationBag = ValidationBag.make();
    validationBag.set('minDate', Validation.make(minDate.get())
        .optional()
        .date()
        .getRule());
    validationBag.set('maxDate', Validation.make(maxDate.get())
        .optional()
        .date()
        .getRule());
    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const today = DateTime.now().toDateString();

    let totalRequests = 0;
    let receivedRequests = 0;
    let inProgressRequests = 0;
    let closedRequests = 0;
    let requests = await this._requestRepository.getAll();
    requests = requests.filter((request) => {
      const createdAt = DateTime.parse(request.creationDate).toDateString();
      let predicate = true;
      if (minCreatedAt) {
        predicate &&= createdAt >= minCreatedAt;
      }
      if (maxCreatedAt) {
        predicate &&= createdAt <= maxCreatedAt;
      }
      return predicate;
    });
    totalRequests = requests.length;
    for (const request of requests) {
      if (request.status === 'new') {
        receivedRequests++;
      }
      if (request.status === 'in-progress') {
        inProgressRequests++;
      }
      if (request.status === 'completed') {
        closedRequests++;
      }
    }

    let totalTasks = 0;
    let createdTasks = 0;
    let activatedTasks = 0;
    let onHoldTasks = 0;
    let closedTasks = 0;
    let tasks = await this._taskRepository.getAll();
    tasks = tasks.filter((task) => {
      const createdAt = DateTime.parse(task.creationDate).toDateString();
      let predicate = true;
      if (minCreatedAt) {
        predicate &&= createdAt >= minCreatedAt;
      }
      if (maxCreatedAt) {
        predicate &&= createdAt <= maxCreatedAt;
      }
      return predicate;
    });
    totalTasks = tasks.length;
    for (const task of tasks) {
      if (task.isClosed || task.status === 'completed') {
        closedTasks++;
        continue;
      }
      if (task.status === 'new') {
        createdTasks++;
      }
      if (task.status === 'active') {
        activatedTasks++;
      }
      if (task.status === 'on-hold') {
        onHoldTasks++;
      }
    }

    let totalCustomers = 0;
    let activeCustomers = 0;
    let invitedCustomers = 0;
    let notInvitedCustomers = 0;
    let blockedCustomers = 0;
    const customers = await this._customerRepository.getAll();
    totalCustomers = customers.length;
    for (const customer of customers) {
      if (customer.isBlocked) {
        blockedCustomers++;
        continue;
      }
      if (customer.isActive) {
        activeCustomers++;
        continue;
      }
      if (customer.isInvited) {
        invitedCustomers++;
      } else {
        notInvitedCustomers++;
      }
    }

    let t1ItemCount = 0;
    let t2ItemCount = 0;
    let t3ItemCount = 0;
    let t1ItemName = '';
    let t2ItemName = '';
    let t3ItemName = '';
    const rankItemsMap: {[id: string]: RankItemData} = {};
    for (const request of requests) {
      for (const item of request.items) {
        if (typeof rankItemsMap[item.itemId] === 'undefined') {
          rankItemsMap[item.itemId] = {
            name: item.name,
            total: item.quantity,
          };
        } else {
          rankItemsMap[item.itemId].total += item.quantity;
        }
      }
    }
    const rankItems = Object.values(rankItemsMap).sort((a, b) => {
      return b.total - a.total;
    });
    if (rankItems.length >= 1) {
      t1ItemCount = rankItems[0].total;
      t1ItemName = rankItems[0].name || 'N/A';
    }
    if (rankItems.length >= 2) {
      t2ItemCount = rankItems[1].total;
      t2ItemName = rankItems[1].name || 'N/A';
    }
    if (rankItems.length >= 3) {
      t3ItemCount = rankItems[2].total;
      t3ItemName = rankItems[2].name || 'N/A';
    }
    let totalItems = 0;
    for (const rankItem of rankItems) {
      totalItems += rankItem.total;
    }

    const busyStaffMap: {[id: string]: boolean} = {};
    for (const task of tasks) {
      for (const attendance of task.attendance) {
        if (attendance.status === 'check-in') {
          busyStaffMap[attendance.staffId] = true;
        }
      }
    }

    let totalStaff = 0;
    let busyStaff = 0;
    let availableStaff = 0;
    const users = await this._userRepository.getAll();
    for (const user of users) {
      if (user.isMobileUser) {
        totalStaff++;
      }
      if (busyStaffMap[user.id]) {
        busyStaff++;
      }
    }
    availableStaff = totalStaff - busyStaff;

    let announcements = await this._announcementRepository.getAll();
    announcements = announcements.filter((announcement) => {
      const createdAt = DateTime.parse(announcement.publishDate).toDateString();
      let predicate = true;
      if (minCreatedAt) {
        predicate &&= createdAt >= minCreatedAt;
      }
      if (maxCreatedAt) {
        predicate &&= createdAt <= maxCreatedAt;
      }
      return predicate;
    });
    let totalAnnouncements = 0;
    let expiredAnnouncements = 0;
    for (const announcement of announcements) {
      if (!announcement.isPublished) {
        continue;
      }
      totalAnnouncements++;
      if (announcement.expirationDate && today > announcement.expirationDate) {
        expiredAnnouncements++;
      }
    }
    const activeAnnouncements = totalAnnouncements - expiredAnnouncements;

    return Result.ok({
      totalRequests,
      receivedRequests,
      inProgressRequests,
      closedRequests,

      totalTasks,
      createdTasks,
      activatedTasks,
      onHoldTasks,
      closedTasks,

      totalCustomers,
      activeCustomers,
      invitedCustomers,
      notInvitedCustomers,
      blockedCustomers,

      totalStaff,
      busyStaff,
      availableStaff,

      totalAnnouncements,
      activeAnnouncements,
      expiredAnnouncements,

      totalItems,
      t1ItemCount,
      t2ItemCount,
      t3ItemCount,
      t1ItemName,
      t2ItemName,
      t3ItemName,
    });
  }
}

export type Counts = {
  totalRequests: number,
  receivedRequests: number,
  inProgressRequests: number,
  closedRequests: number,

  totalTasks: number;
  createdTasks: number;
  activatedTasks: number;
  onHoldTasks: number;
  closedTasks: number;

  totalCustomers: number;
  activeCustomers: number;
  invitedCustomers: number;
  notInvitedCustomers: number;
  blockedCustomers: number;

  totalStaff: number;
  busyStaff: number;
  availableStaff: number;

  totalAnnouncements: number;
  activeAnnouncements: number;
  expiredAnnouncements: number;

  totalItems: number;
  t1ItemCount: number;
  t2ItemCount: number;
  t3ItemCount: number;
  t1ItemName: string;
  t2ItemName: string;
  t3ItemName: string;
};

type RankItemData = {
  name: string;
  total: number;
};
