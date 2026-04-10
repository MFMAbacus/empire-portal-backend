import { Failure } from "@/utility/failure";
import { Result } from "@/utility/result";
import { PaymentRepository } from "@/repositories/payment-repository";
import { Attribute } from "@/utility/attribute";
import { Validation } from "@/utility/validation";

type Props = {
  paymentRepository: PaymentRepository;
};

type Input = {
  id?: boolean;
};

export class PostPaymentToSap {
  protected _paymentRepository: PaymentRepository;
  public constructor(props: Props) {
    this._paymentRepository = props.paymentRepository;
  }

  public async execute(input: Input): Promise<Result<undefined, Failure>> {
    const id = Attribute.make(input.id);

    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();

    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    return Result.ok(undefined);
  }
}
