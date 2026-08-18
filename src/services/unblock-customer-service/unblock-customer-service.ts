import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { CustomerModel } from "@/models/customer-model";
import { CustomerRepository } from "@/repositories/customer-repository";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  id: string;
};

export class UnblockCustomerService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(input: Input): Promise<Result<string, Failure>> {
    const id = Attribute.make(input.id);
    const idValidationRule = Validation.make(id.get())
      .mandatory()
      .string()
      .getRule();
    if (idValidationRule.isError()) {
      return Result.fail(Failure.notFound());
    }

    const customerRecord = await this._customerRepository.get(id.get());
    if (typeof customerRecord === "undefined") {
      return Result.fail(Failure.notFound());
    }

    customerRecord.isBlocked = false;

    await this._customerRepository.Update(customerRecord);

    return Result.ok(customerRecord.id);
  }
}
