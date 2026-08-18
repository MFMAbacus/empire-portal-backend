import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { ValidationRule } from "@/utility/validation-rule";
import { optional } from "@/utility/optional";
import { DateTime } from "@/utility/date-time";
import NotificationFCM from "@/utility/notification/notification";

import {
  RequestPriority,
  RequestType,
  RequestVisitTime,
} from "@/records/request-record";
import { RequestModel } from "@/models/request-model";
import { CustomerRepository } from "@/repositories/customer-repository";
import { RequestRepository } from "@/repositories/request-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import { SessionRecord } from "@/records/session-record";
import { UserRepository } from "@/repositories/user-repository";

import { getTokensByUserId } from "@/data/clients-sessions";

import { RequestUpdate } from "@/schemas/request-schema";
import { transactionService } from "../transaction-service";

type Props = {
  customerRepository: CustomerRepository;
  requestRepository: RequestRepository;
  categoryRepository: CategoryRepository;
  userRepository: UserRepository;
};

type Input = {
  sessionRecord: SessionRecord;
  type: RequestType;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  project: string;
  subCategoryName?: string;
  customerId: string;
  customerCode: string;
  unitId: string;
  unitName: string;
  subject: string | null;
  priority?: RequestPriority;
  visitDate: string;
  visitTime?: RequestVisitTime;
  totalPrice?: number;
  attachments?: string[];
  isIntangible?: boolean;
};

export class CreateRequestService {
  protected _customerRepository: CustomerRepository;
  protected _requestRepository: RequestRepository;
  protected _userRepository: UserRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
    this._requestRepository = props.requestRepository;
    this._userRepository = props.userRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const updateData = new RequestUpdate({
      id: Generator.shortToken(),
      userId: input.sessionRecord.userId,
      // eslint-disable-next-line max-len
      userName: `${input.sessionRecord.firstName} ${input.sessionRecord.lastName}`,
      type: "created",
      date: DateTime.now().toString(),
    });

    const requestModel = RequestModel.make({
      id: Generator.id(requestTypeIdPrefix[input.type]),
      type: input.type,
      categoryId: input.categoryId,
      categoryName: input.categoryName,
      project: optional(input.project, null),
      subCategoryName: optional(input.subCategoryName, null),
      title: input.title,
      description: input.description,
      customerId: input.customerId,
      customerName: "N/A",
      customerCode: input.customerCode,
      staffId: null,
      staffName: null,
      salesPersonId: null,
      unitId: input.unitId,
      unitName: input.unitName,
      status: "new",
      priority: optional(input.priority, "medium"),
      visitDate: input.visitDate,
      visitTime: optional(input.visitTime, "none"),
      totalPrice: optional(input.totalPrice, 0),
      totalPayments: 0,
      isApproved: false,
      approvedAt: null,
      approveRemarks: null,
      isRefused: false,
      refusedAt: null,
      refuseRemarks: null,
      completedAt: null,
      completeRemarks: null,
      completeAttachments: [],
      items: [],
      attachments: optional(input.attachments, []),
      updates: [updateData],
      payments: [],
      rate: null,
      isIntangible: optional(input.isIntangible, false),
      pin: null,
      buyAttachments: [],
      creationDate: DateTime.now().toString(),
      isArchived: false,
    });

    const validationBag = requestModel.validate();

    if (!validationBag.hasError("customerId")) {
      const customerRecord = await this._customerRepository.get(
        input.customerId
      );
      if (typeof customerRecord === "undefined") {
        validationBag.set("customerId", ValidationRule.valueIsInvalid());
      } else {
        const customerName = `${customerRecord.firstName} ${customerRecord.lastName}`;
        requestModel.set("customerName", customerName);
        requestModel.set("status", "in-progress");
      }
    }

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    if (
      requestModel.get("isIntangible") &&
      requestModel.get("type") === "buy"
    ) {
      const staffRecord = await this._userRepository.getCachier(
        requestModel.get("categoryName"),
        requestModel.get("project")
      );
      if (typeof staffRecord !== "undefined") {
        requestModel.set("staffId", staffRecord.id);
        const staffName = staffRecord.firstName + "" + staffRecord.lastName;
        requestModel.set("staffName", staffName);
      }

      if (requestModel.get("staffId")) {
        const staffTokens = getTokensByUserId(requestModel.get("staffId"));

        await Promise.all(
          [
            staffTokens.length > 0 &&
              NotificationFCM.getInstance().sendToMany(
                {
                  messageId: Generator.id(),
                  title: "Request Assigned",
                  body: `Dear ${requestModel.get("staffName")},
        The request ${requestModel.get("id")} has been assigned to you.`,
                  id: requestModel.get("id"),
                  type: "request",
                },
                staffTokens
              ),
          ].filter(Boolean)
        );
      }
    }

    await this._requestRepository.Create(requestModel.getRecord());

    await transactionService.logRequestCreated(requestModel.getRecord());

    return Result.ok(requestModel.get("id"));
  }
}

const requestTypeIdPrefix: { [type: string]: string } = {
  general: "RQ",
  maintenance: "RM",
  buy: "RU",
};
