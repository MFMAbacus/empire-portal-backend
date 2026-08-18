import {AccessMediatorService} from '@/services/access-mediator-service';
import {CreateInvoicePaymentService} from './create-invoice-payment-service';

import {getSessionService} from '@/services/get-session-service';

// eslint-disable-next-line max-len
import {invoicePaymentRepository} from '@/repositories/invoice-payment-repository';

export const createInvoicePaymentService = new AccessMediatorService({
  getSessionService,
  service: new CreateInvoicePaymentService({
    invoicePaymentRepository,
  }),
  roles: [
    'customer',
  ],
});

export * from './create-invoice-payment-service';
