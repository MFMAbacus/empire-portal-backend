import { Result } from "@/utility/result";
import { Validation } from "@/utility/validation";
import { Failure } from "@/utility/failure";
import { Attribute } from "@/utility/attribute";

import { ICustomerRecord } from "@/schemas/customer-schema/cutomer-schema";
import { CustomerRepository } from "@/repositories/customer-repository";
import { SessionRecord } from "@/records/session-record";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  id: string;
  sessionRecord: SessionRecord;
};

export class GetCustomerService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICustomerRecord, Failure>> {
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

    if (input.sessionRecord.role !== "manager") {
      if (input.sessionRecord.userId !== customerRecord.id) {
        return Result.fail(Failure.notFound());
      }
    }

    return Result.ok(customerRecord);
  }
}
