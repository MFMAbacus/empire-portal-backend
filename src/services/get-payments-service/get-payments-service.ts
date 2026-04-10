import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {PaymentRepository} from '@/repositories/payment-repository';

type Props = {
  paymentRepository: PaymentRepository
};

export class GetPaymentsService {
  protected _paymentRepository: PaymentRepository;

  public constructor(props: Props) {
    this._paymentRepository = props.paymentRepository;
  }

  public async execute(): Promise<Result<unknown, Failure>> {
    const paymentsRecords = await this._paymentRepository.getAll();
    return Result.ok(paymentsRecords);
  }
}
