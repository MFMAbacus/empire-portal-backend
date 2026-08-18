import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Generator } from "@/utility/generator";
import { TransactionRepository } from "@/repositories/transaction-repository";
import {
  ITransactionRecord,
  PaymentTypes,
  RequestTypes,
  RequestTypeTransactionMap,
  TaskTypes,
  TransactionStatus,
  TransactionType,
} from "@/records/transaction-record";

import { IPaymentRecord } from "@/schemas/payment-schema";
import { IInvoicePaymentRecord } from "@/schemas/invoice-payment-schema";
import { IRequestRecord } from "@/schemas/request-schema";
import { TaskRecord, SubTaskRecord } from "@/records/task-record";

type Props = {
  transactionRepository: TransactionRepository;
};

export class TransactionService {
  protected _transactionRepository: TransactionRepository;

  public constructor(props: Props) {
    this._transactionRepository = props.transactionRepository;
  }

  // ============== PAYMENT TRANSACTIONS ==============

  public async logPaymentCreated(
    payment: IPaymentRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: payment.id,
      status: TransactionStatus.PAYMENT_CREATED,
      description: `Request payment created - ${payment.method}`,
      amount: String(payment.totalAmount),
      subType: PaymentTypes.REQUEST_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  public async logPaymentConfirmed(
    payment: IPaymentRecord,
    sapRefCode?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: payment.id,
      status: TransactionStatus.PAYMENT_CONFIRMEND,
      sapRefCode: payment.docNum ?? "",
      amount: String(payment.totalAmount),
      description: `Request payment confirmed - ${payment.method} - ${sapRefCode}`,
      subType: PaymentTypes.REQUEST_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  public async logPaymentFailed(
    payment: IPaymentRecord,
    reason?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: payment.id,
      status: TransactionStatus.PAYMENT_FAILED,
      message: reason,
      amount: String(payment.totalAmount),
      description: `Request payment failed - ${payment.method}`,
      subType: PaymentTypes.REQUEST_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  public async logB1CreateInvoiceFailed(
    payment: IPaymentRecord,
    reason?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: payment.id,
      status: TransactionStatus.B1_CREATE_INVOICE_FAILED,
      message: reason,
      amount: String(payment.totalAmount),
      description: `${reason}`,
      subType: PaymentTypes.REQUEST_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  public async logPaymentSubmitted(
    payment: IPaymentRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: payment.id,
      status: TransactionStatus.IN_PROGRESS,
      amount: String(payment.totalAmount),
      description: `Request payment submitted - ${payment.method}`,
      subType: PaymentTypes.REQUEST_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  public async logInvoicePaymentCreated(
    invoicePayment: IInvoicePaymentRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: invoicePayment.id,
      status: TransactionStatus.PAYMENT_CREATED,
      amount: String(invoicePayment.totalAmount),
      description: `Invoice payment created - ${invoicePayment.method}`,
      subType: PaymentTypes.INVOICE_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  public async logInvoicePaymentConfirmed(
    invoicePayment: IInvoicePaymentRecord,
    sapRefCode?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: invoicePayment.id,
      status: TransactionStatus.PAYMENT_CONFIRMEND,
      amount: String(invoicePayment.totalAmount),
      sapRefCode: invoicePayment.docNum ?? "",
      description: `Invoice payment confirmed - ${invoicePayment.method} - ${sapRefCode}`,
      subType: PaymentTypes.INVOICE_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  public async logInvoicePaymentFailed(
    invoicePayment: IInvoicePaymentRecord,
    reason?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: invoicePayment.id,
      status: TransactionStatus.PAYMENT_FAILED,
      amount: String(invoicePayment.totalAmount),
      message: reason,
      description: `Invoice payment failed - ${invoicePayment.method}`,
      subType: PaymentTypes.INVOICE_PAYMENT,
      type: TransactionType.SERVICE_PAYMENT,
    });
  }

  // ============== REQUEST TRANSACTIONS ==============

  public async logRequestCreated(
    request: IRequestRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_CREATED,
      description: `Request created - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestAssigned(
    request: IRequestRecord,
    staffName?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_ASSIGNED,
      description: `Request assigned to ${staffName || "staff"} - ${
        request.categoryName
      }`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestApproved(
    request: IRequestRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_APPROVED,
      description: `Request approved - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestCompleted(
    request: IRequestRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_COMPLETED,
      description: `Request completed - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestRefused(
    request: IRequestRecord,
    reason?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_REFUSED,
      message: reason,
      description: `Request refused - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestRated(
    request: IRequestRecord,
    rating: number
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_RATED,
      message: `Rating: ${rating}`,
      description: `Request rated - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestDeleted(
    request: IRequestRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_DELETED,
      description: `Request deleted - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestItemsSet(
    request: IRequestRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_ITEMS_SET,
      description: `Request items updated - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  public async logRequestPinSet(
    request: IRequestRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: request.id,
      status: TransactionStatus.REQUEST_PIN_SET,
      description: `Request pin set - ${request.categoryName}`,
      subType: request.categoryName,
      type: RequestTypeTransactionMap[request.type],
    });
  }

  // ============== TASK TRANSACTIONS ==============

  public async logTaskCreated(
    task: TaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_CREATED,
      description: `Task created - ${task.title}`,
      subType: TaskTypes.TASK_CREATED,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskAssigned(
    task: TaskRecord,
    staffName?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_ASSIGNED,
      description: `Task assigned to ${
        staffName || task.staffName || "staff"
      } - ${task.title}`,
      subType: TaskTypes.TASK_ASSIGNED,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskCompleted(
    task: TaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_COMPLETED,
      description: `Task completed - ${task.title}`,
      subType: TaskTypes.TASK_COMPLETED,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskClosed(
    task: TaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_CLOSED,
      description: `Task closed - ${task.title}`,
      subType: TaskTypes.TASK_CLOSED,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskPaused(
    task: TaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_PAUSED,
      description: `Task paused - ${task.title}`,
      subType: TaskTypes.TASK_PAUSED,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskResumed(
    task: TaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_RESUMED,
      description: `Task resumed - ${task.title}`,
      subType: TaskTypes.TASK_RESUMED,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskCheckedIn(
    task: TaskRecord,
    staffName: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_CHECKED_IN,
      description: `Task checked in by ${staffName} - ${task.title}`,
      subType: TaskTypes.TASK_CHECKED_IN,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskCheckedOut(
    task: TaskRecord,
    staffName: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_CHECKED_OUT,
      description: `Task checked out by ${staffName} - ${task.title}`,
      subType: TaskTypes.TASK_CHECKED_OUT,
      type: TransactionType.GENERAL,
    });
  }

  public async logTaskDeleted(
    task: TaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.TASK_DELETED,
      description: `Task deleted - ${task.title}`,
      subType: TaskTypes.TASK_DELETED,
      type: TransactionType.GENERAL,
    });
  }

  public async logSubTaskCreated(
    task: TaskRecord,
    subTask: SubTaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.SUB_TASK_CREATED,
      message: `Sub-task: ${subTask.title}`,
      description: `Sub-task created for ${task.title}`,
      subType: TaskTypes.SUB_TASK_CREATED,
      type: TransactionType.GENERAL,
    });
  }

  public async logSubTaskAssigned(
    task: TaskRecord,
    subTask: SubTaskRecord,
    staffName?: string
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.SUB_TASK_ASSIGNED,
      message: `Sub-task: ${subTask.title}`,
      description: `Sub-task assigned to ${
        staffName || subTask.staffName || "staff"
      } for ${task.title}`,
      subType: TaskTypes.SUB_TASK_ASSIGNED,
      type: TransactionType.GENERAL,
    });
  }

  public async logSubTaskCompleted(
    task: TaskRecord,
    subTask: SubTaskRecord
  ): Promise<Result<ITransactionRecord, Failure>> {
    return this.createTransactionRecord({
      transactionRefCode: task.id,
      status: TransactionStatus.SUB_TASK_COMPLETED,
      message: `Sub-task: ${subTask.title}`,
      description: `Sub-task completed for ${task.title}`,
      subType: TaskTypes.SUB_TASK_COMPLETED,
      type: TransactionType.GENERAL,
    });
  }

  // ============== PRIVATE HELPER ==============

  private async createTransactionRecord(data: {
    transactionRefCode: string;
    status: TransactionStatus;
    type: TransactionType;
    amount?: string;
    sapRefCode?: string;
    message?: string;
    description: string;
    subType: string;
  }): Promise<Result<ITransactionRecord, Failure>> {
    try {
      const transactionRecord: ITransactionRecord = {
        id: Generator.id("T"),
        type: data.type,
        subType: data.subType,
        status: data.status,
        amount: data.amount ?? "",
        transactionRefCode: data.transactionRefCode,
        sapRefCode: data.sapRefCode,
        message: data.message,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this._transactionRepository.Create(transactionRecord);
      return Result.ok(transactionRecord);
    } catch (error) {
      return Result.fail(
        Failure.make({
          code: "transaction-creation-failed",
          data: error,
        })
      );
    }
  }
}
