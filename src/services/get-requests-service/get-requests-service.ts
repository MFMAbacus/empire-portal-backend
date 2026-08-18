import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { RequestRecord } from "@/records/request-record";
import { RequestRepository } from "@/repositories/request-repository";
import { SessionRecord } from "@/records/session-record";
import { IRequestRecord } from "@/schemas/request-schema";

type Props = {
  requestRepository: RequestRepository;
};

type Input = {
  unitId?: string;
  isArchived?: boolean;
  sessionRecord: SessionRecord;
  IsPayment?: boolean;
};

export class GetRequestsService {
  protected _requestRepository: RequestRepository;

  public constructor(props: Props) {
    this._requestRepository = props.requestRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<RequestRecord[], Failure>> {
    let requestsRecords = await this._requestRepository.getAll();

    requestsRecords = requestsRecords.filter((current) => {
      if (!input.isArchived) {
        // If input.isArchived is false, include records with isArchived = false and isShow = true
        return !current.isArchived && current.isShow;
      } else {
        // If input.isArchived is true, include records with isArchived = true or isShow = false
        return current.isArchived || !current.isShow;
      }
    });

    if (typeof input.unitId !== "undefined") {
      requestsRecords = requestsRecords.filter((current) => {
        return current.unitId === input.unitId;
      });
    }

    if (input.sessionRecord.role === "staff") {
      requestsRecords = requestsRecords.filter((request) => {
        return request.staffId === input.sessionRecord.userId;
      });
    }

    if (input.sessionRecord.role === "customer") {
      requestsRecords = requestsRecords.filter((request) => {
        return request.customerId === input.sessionRecord.userId;
      });
    }

    if (typeof input.IsPayment !== "undefined") {
      if (input.IsPayment) {
        requestsRecords = requestsRecords.filter((request) => {
          return (
            (request.type === "buy" &&
              request.totalPayments === 0 &&
              request.totalPrice > 0) ||
            (request.type === "maintenance" &&
              request.isApproved &&
              request.totalPayments === 0 &&
              request.totalPrice > 0)
          );
        });
      }
    }

    if (requestsRecords && input.sessionRecord.role !== "manager") {
      requestsRecords = requestsRecords.filter((request) => {
        // Exclude requests with type 'buy', category 'electricity' or 'internet',
        // and where paymentStatus is not 'Paid'
        return !(
          request.type === "buy" &&
          (request.categoryName === "Electricity" ||
            request.categoryName === "Internet") &&
          request.paymentStatus !== "Paid"
        );
      });
    }

    // if (input.sessionRecord.role === "manager") {
    //   if (input.isArchived) {
    //     // Modify requests and mark them as archived
    //     requestsRecords = requestsRecords.map((request) => {
    //       if (
    //         (request.paymentStatus === "Unpaid" ||
    //           request.paymentStatus === "Pending") &&
    //         request.status === "in-progress" &&
    //         request.type === "buy"
    //       ) {
    //         return { ...request, isArchived: true }; // Mark as archived
    //       }
    //       return request;
    //     });
    //   } else {
    //     // Exclude archived requests
    //     requestsRecords = requestsRecords.filter((request) => {
    //       return !(
    //         (request.paymentStatus === "Unpaid" ||
    //           request.paymentStatus === "Pending") &&
    //         request.status === "in-progress" &&
    //         request.type === "buy"
    //       );
    //     });
    //   }
    // }
    return Result.ok(requestsRecords);

    // if (input.sessionRecord.role === "manager" && input.isArchived) {
    //   requestsRecords.forEach((request) => {
    //     if (
    //       (request.paymentStatus === "Unpaid" ||
    //         request.paymentStatus === "Pending") &&
    //       request.status === "in-progress"
    //     ) {
    //       request.isArchived = true;
    //     }
    //   });
    // }
    return Result.ok(requestsRecords);
  }
}
