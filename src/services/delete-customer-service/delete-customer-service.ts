import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { CustomerRepository } from "@/repositories/customer-repository";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  id: string;
};

export class DeleteCustomerService {
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

    if (!(await this._customerRepository.Exists(id.get()))) {
      return Result.fail(Failure.notFound());
    }

    await this._customerRepository.Delete(id.get());

    return Result.ok(id.get());
  }
}
