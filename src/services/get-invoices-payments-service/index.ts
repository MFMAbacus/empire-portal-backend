import {AccessMediatorService} from '@/services/access-mediator-service';
import {getSessionService} from '@/services/get-session-service';
import {GetInvoicesPaymentsService} from './get-invoices-payments-service';

// eslint-disable-next-line max-len
import {invoicePaymentRepository} from '@/repositories/invoice-payment-repository';

export const getInvoicesPaymentsService = new AccessMediatorService({
  getSessionService,
  service: new GetInvoicesPaymentsService({
    invoicePaymentRepository,
  }),
  roles: [
    'manager',
  ],
});

export * from './get-invoices-payments-service';
