import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

// eslint-disable-next-line max-len
import {InvoicePaymentRepository} from '@/repositories/invoice-payment-repository';

type Props = {
  invoicePaymentRepository: InvoicePaymentRepository
};

export class GetInvoicesPaymentsService {
  protected _invoicePaymentRepository: InvoicePaymentRepository;

  public constructor(props: Props) {
    this._invoicePaymentRepository = props.invoicePaymentRepository;
  }

  public async execute(): Promise<Result<unknown, Failure>> {
    const records = await this._invoicePaymentRepository.getAll();
    return Result.ok(records);
  }
}
